import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection
from datetime import datetime

cadastrar_ativo_bp = Blueprint('cadastrar_ativo', __name__)

@cadastrar_ativo_bp.route('/cadastrar_ativo', methods=['POST'])
def cadastrar_ativo():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        data = request.json
        nome = data.get('name')
        categoria_id = data.get('category_id')
        quantidade = data.get('quantity')
        descricao = data.get('description')
        estado = data.get('state')
        local = data.get('local')
        specific_fields = data.get('specificFields', {})

        usuario = data.get('user') 
        nome_usuario = data.get('nome')

        # Verificar o último identificador para a categoria
        cursor = conn.cursor()
        cursor.execute("""
            SELECT identificacao 
            FROM ativos 
            WHERE categoria_id = %s 
            ORDER BY identificacao DESC 
            LIMIT 1
        """, (categoria_id,))
        last_id = cursor.fetchone()

        # Gerar o próximo identificador
        cursor.execute("SELECT nome FROM categorias WHERE id = %s", (categoria_id,))
        category_name = cursor.fetchone()
        if not category_name:
            return jsonify({"error": "Categoria inválida"}), 400

        prefix = category_name[0][:3].upper()
        next_number = int(last_id[0][3:]) + 1 if last_id else 1
        identificacao = f"{prefix}{str(next_number).zfill(3)}"

        # Inserir o ativo no banco de dados
        cursor.execute("""
            INSERT INTO ativos (nome, categoria_id, quantidade, descricao, identificacao, estado, local)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (nome, categoria_id, quantidade, descricao, identificacao, estado, local))
        ativo_id = cursor.lastrowid 

        # Mapeamento de categorias para tabelas e colunas
        category_mapping = {
            1: ("adaptadores", ["tipo", "conexao_entrada", "conexao_saida"]),
            2: ("armazenamento", ["tipo", "capacidade", "interface"]),
            3: ("cabos", ["tipo", "comprimento", "material"]),
            5: ("desktops", ["processador", "memoria_ram", "armazenamento", "fonte_alimentacao"]),
            7: ("fontes", ["potencia_watts", "modular"]),
            9: ("memorias_ram", ["capacidade", "tipo", "frequencia", "latencia"]),
            10: ("monitores", ["tamanho_polegadas", "resolucao", "tipo_painel", "taxa_atualizacao", "conexoes"]),
            11: ("notebooks", ["processador", "memoria_ram", "armazenamento", "tamanho_tela", "bateria"]),
            12: ("nucs", ["processador", "memoria_ram", "armazenamento"]),
            13: ("perifericos", ["tipo", "conexao", "marca"]),
            14: ("redes", ["tipo", "velocidade", "interface", "protocolo_suportado"]),
            15: ("telefonia", ["tipo", "tecnologia", "compatibilidade"]),
        }

        # Inserir os campos específicos na tabela correspondente
        if specific_fields and categoria_id in category_mapping:
            table_name, columns = category_mapping[categoria_id]
            column_placeholders = ", ".join(["%s"] * len(columns))
            column_names = ", ".join(columns)
            values = [specific_fields.get(col.replace("_", " ").title()) for col in columns]

            cursor.execute(f"""
                INSERT INTO {table_name} (ativo_id, {column_names})
                VALUES (%s, {column_placeholders})
            """, [ativo_id] + values)

        conn.commit()

        # Adicionar entrada no log
        log_message = (
            f"[{datetime.now().strftime('%d/%m/%Y %Hh%M')}] "
            f"Usuário: {usuario}, Nome: {nome_usuario}, Movimentação: Cadastrou novo ativo {nome}, Identificação: {identificacao} "
        )
        with open('/home/usshd/estoque_ti/estoqueti_backend/logs.log', 'a') as log_file:
            log_file.write(log_message + '\n')

        return jsonify({"message": "Ativo cadastrado com sucesso", "identificacao": identificacao}), 200

    except Exception as e:
        conn.rollback()
        print(f"Erro ao cadastrar ativo: {str(e)}")
        return jsonify({"error": f"Erro ao cadastrar ativo: {str(e)}"}), 500
    finally:
        close_connection(conn)
