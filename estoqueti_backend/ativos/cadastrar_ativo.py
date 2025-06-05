import os
from flask import Blueprint, request, jsonify, send_file, send_from_directory
from db import get_connection, close_connection
from datetime import datetime
from barcode import Code128
from barcode.writer import ImageWriter

cadastrar_ativo_bp = Blueprint('cadastrar_ativo', __name__)

BARCODE_DIR = os.path.join(os.path.dirname(__file__), '..', 'barcodes')

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

        # Verificar o número de entradas para a categoria
        cursor = conn.cursor()
        cursor.execute("""
            SELECT COUNT(*) 
            FROM ativos 
            WHERE categoria_id = %s
        """, (categoria_id,))
        total_entries = cursor.fetchone()[0]

        # Buscar o maior número já existente para a categoria
        cursor = conn.cursor()
        cursor.execute("SELECT nome FROM categorias WHERE id = %s", (categoria_id,))
        category_name = cursor.fetchone()
        if not category_name:
            return jsonify({"error": "Categoria inválida"}), 400

        prefix = category_name[0][:3].upper()

        cursor.execute("""
            SELECT identificacao FROM ativos WHERE categoria_id = %s AND identificacao LIKE %s
        """, (categoria_id, f"{prefix}%"))
        identificacoes = cursor.fetchall()
        max_number = 0
        for row in identificacoes:
            ident = row[0]
            # Extrai a parte numérica do identificador (ex: ADA002 -> 2)
            try:
                number_part = int(ident[len(prefix):])
                if number_part > max_number:
                    max_number = number_part
            except Exception:
                continue
        next_number = max_number + 1
        identificacao = f"{prefix}{str(next_number).zfill(3)}"

        # Gerar o caminho absoluto para o código de barras
        barcode_path = os.path.join(BARCODE_DIR, f"{identificacao}")
        try:
            # Garantir que o diretório de códigos de barras exista
            os.makedirs(BARCODE_DIR, exist_ok=True)
            
            # Gerar e salvar o código de barras
            barcode = Code128(identificacao, writer=ImageWriter())
            barcode.save(barcode_path)
        except Exception as barcode_error:
            return jsonify({"error": f"Erro ao gerar código de barras: {str(barcode_error)}"}), 500

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

            normalized_fields = {
                key.lower().replace(" ", "_").replace("ç", "c").replace("ã", "a").replace("í", "i").replace("ê", "e").replace("õ", "o").replace("ó", "o"): value
                for key, value in specific_fields.items()
            }
            values = [normalized_fields.get(col) for col in columns]

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

        return jsonify({"message": "Ativo cadastrado com sucesso", "identificacao": identificacao, "barcode_path": barcode_path}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"Erro ao cadastrar ativo: {str(e)}"}), 500
    finally:
        close_connection(conn)

@cadastrar_ativo_bp.route('/get_barcode', methods=['GET'])
def get_barcode():
    identificacao = request.args.get('identificacao')
    if not identificacao:
        return jsonify({"error": "Identificação não fornecida"}), 400

    # Usar o caminho absoluto para buscar o código de barras
    barcode_path = os.path.join(BARCODE_DIR, f"{identificacao}.png")
    if not os.path.exists(barcode_path):
        return jsonify({"error": "Código de barras não encontrado"}), 404

    try:
        # Retornar a URL relativa para o frontend
        return jsonify({"barcode_url": f"/barcodes/{identificacao}.png"}), 200
    except Exception as e:
        return jsonify({"error": f"Erro ao enviar código de barras: {str(e)}"}), 500
