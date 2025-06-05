import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection
from send_email import send_alerta_estoque

validador_bp = Blueprint('validador', __name__)

@validador_bp.route('/validador', methods=['POST'])
def validador():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        data = request.json
        entrada_id = data.get('id')  
        acao = data.get('acao')    


        if not entrada_id or acao not in ['aprovado', 'recusado']:
            return jsonify({"error": "Dados inválidos"}), 400

        cursor = conn.cursor()

        # Buscar dados da movimentação
        cursor.execute("SELECT ativo_id, quantidade, movimentacao FROM entradas_saidas WHERE id = %s", (entrada_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({"error": "Movimentação não encontrada"}), 404

        ativo_id, quantidade, movimentacao = row

        if acao == 'recusado':
            cursor.execute("UPDATE entradas_saidas SET status = %s WHERE id = %s", ('Recusado', entrada_id))
            conn.commit()
            return jsonify({"message": "Movimentação recusada"}), 200

        elif acao == 'aprovado':
            # Atualizar status para Concluído
            cursor.execute("UPDATE entradas_saidas SET status = %s WHERE id = %s", ('Concluído', entrada_id))

            # Buscar quantidade atual do ativo
            cursor.execute("SELECT quantidade, nome, est_alerta, identificacao FROM ativos WHERE id = %s", (ativo_id,))
            ativo_row = cursor.fetchone()
            if not ativo_row:
                conn.rollback()
                return jsonify({"error": "Ativo não encontrado"}), 404

            quantidade_atual, nome_ativo, est_alerta, identificacao = ativo_row

            # Buscar nome do usuário responsável pela movimentação
            cursor.execute("""
                SELECT u.nome FROM entradas_saidas es
                JOIN usuarios u ON es.usuario_id = u.id
                WHERE es.id = %s
            """, (entrada_id,))
            usuario_row = cursor.fetchone()
            nome_usuario = usuario_row[0] if usuario_row else ""

            # Atualizar quantidade do ativo conforme movimentação
            if movimentacao.lower() == 'entrada':
                nova_quantidade = quantidade_atual + quantidade
            elif movimentacao.lower() == 'retirada':
                nova_quantidade = quantidade_atual - quantidade
            else:
                conn.rollback()
                return jsonify({"error": "Tipo de movimentação inválido"}), 400

            cursor.execute("UPDATE ativos SET quantidade = %s WHERE id = %s", (nova_quantidade, ativo_id))
            conn.commit()

            # Enviar alerta se necessário
            if est_alerta is not None and int(nova_quantidade) <= int(est_alerta):
                try:
                    send_alerta_estoque(
                        nome=nome_ativo,
                        identificacao=identificacao,
                        quantidade=nova_quantidade,
                        est_alerta=est_alerta,
                        nome_usuario=nome_usuario
                    )
                except Exception as e:
                    print(f"Erro ao enviar alerta de estoque: {e}")

            return jsonify({"message": "Movimentação aprovada e estoque atualizado"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"Erro: {str(e)}"}), 500
    finally:
        close_connection(conn)