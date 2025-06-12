import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection
from datetime import datetime
from send_email import send_alerta_estoque

editar_ativo_bp = Blueprint('editar_ativo', __name__)

@editar_ativo_bp.route('/editar_ativo', methods=['POST'])
def editar_ativo():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        data = request.json
        ativo_id = data.get('ativo_id')
        nome = data.get('name')
        identification = data.get('identification')
        categoria_id = data.get('category_id')
        quantidade = data.get('quantity')
        descricao = data.get('description')
        estado = data.get('state')
        local = data.get('local')
        serial = data.get('serial')
        specific_fields = data.get('specificFields', {})

        usuario = data.get('user')
        nome_usuario = data.get('nome')

        # Verifica limite de alerta antes de atualizar a quantidade
        cursor = conn.cursor()
        cursor.execute(
            "SELECT nome, est_alerta, quantidade, identificacao FROM ativos WHERE id = %s",
            (ativo_id,)
        )
        ativo_row = cursor.fetchone()
        nome_ativo = ativo_row[0] if ativo_row else nome
        est_alerta = ativo_row[1] if ativo_row else None
        quantidade_atual = ativo_row[2] if ativo_row else None
        identificacao_ativo = ativo_row[3] if ativo_row else identification

        # Atualizar o ativo na tabela principal
        cursor.execute("""
            UPDATE ativos
            SET nome = %s, categoria_id = %s, quantidade = %s, descricao = %s, estado = %s, local = %s, serial = %s
            WHERE id = %s
        """, (nome, categoria_id, quantidade, descricao, estado, local, serial, ativo_id))

        # Envia alerta se necessário
        if est_alerta is not None and int(quantidade) <= int(est_alerta):
            try:
                send_alerta_estoque(
                    nome=nome_ativo,
                    identificacao=identificacao_ativo,
                    quantidade=quantidade,
                    est_alerta=est_alerta,
                    nome_usuario=nome_usuario
                )
            except Exception as e:
                print(f"Erro ao enviar alerta de estoque: {e}")

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

        # Atualizar os campos específicos na tabela correspondente
        if specific_fields and categoria_id in category_mapping:
            table_name, columns = category_mapping[categoria_id]
            set_clause = ", ".join([f"{col} = %s" for col in columns])

            normalized_fields = {
                key.lower().replace(" ", "_").replace("ç", "c").replace("ã", "a").replace("í", "i").replace("ê", "e").replace("õ", "o").replace("ó", "o"): value
                for key, value in specific_fields.items()
            }

            # Tratamento especial para fontes/modular
            if categoria_id == 7 and 'modular' in normalized_fields:
                modular_val = normalized_fields['modular']
                if modular_val == 'Sim' or modular_val == 1 or modular_val == '1':
                    normalized_fields['modular'] = 1
                elif modular_val == 'Não' or modular_val == 0 or modular_val == '0':
                    normalized_fields['modular'] = 0

            values = [normalized_fields.get(col) for col in columns]

            sql_query = f"""
                UPDATE {table_name}
                SET {set_clause}
                WHERE ativo_id = %s
            """

            cursor.execute(sql_query, values + [ativo_id])

        conn.commit()

        # Adicionar entrada no log
        log_message = (
            f"[{datetime.now().strftime('%d/%m/%Y %Hh%M')}] "
            f"Usuário: {usuario}, Nome: {nome_usuario}, Movimentação: Editou o ativo {nome}, Identificação: {identification} "
        )
        with open('/home/usshd/estoque_ti/estoqueti_backend/logs.log', 'a') as log_file:
            log_file.write(log_message + '\n')

        return jsonify({"message": "Ativo editado com sucesso", "ativo_id": identification}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"Erro ao editar ativo: {str(e)}"}), 500
    finally:
        close_connection(conn)

@editar_ativo_bp.route('/editar_ativo_sup', methods=['POST'])
def editar_ativo_sup():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        data = request.json
        ativo_id = data.get('ativo_id')
        supervisionado = data.get('supervisionado')
        
        # Atualizar o ativo na tabela principal
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE ativos
            SET supervisionado= %s
            WHERE id = %s
        """, (supervisionado, ativo_id))
        conn.commit()

        return jsonify({"message": "Ativo editado com sucesso"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"Erro ao editar ativo: {str(e)}"}), 500
    finally:
        close_connection(conn)
