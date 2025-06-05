import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection
from datetime import datetime
from send_email import send_email, send_alerta_estoque  

controle_ativo_bp = Blueprint('controle_ativo', __name__)

@controle_ativo_bp.route('/controle_ativo', methods=['POST'])
def controle_ativo():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        data = request.json
        identification = data.get('identification')
        new_quantity = data.get('quantity')
        usuario = data.get('user')
        nome_usuario = data.get('nome')
        nome = data.get('ativo_nome')
        movimentacao = data.get('movimentacao')  
        supervisionado = data.get('supervisionado')  

        if not all([identification, new_quantity is not None, usuario, nome_usuario, nome, movimentacao]):
            return jsonify({"error": "Dados incompletos"}), 400

        cursor = conn.cursor()
        if supervisionado == 1:
            # Inserir solicitação na tabela entradas_saidas
            now = datetime.now().strftime('%d/%m/%Y %Hh%M')
            # Buscar usuario_id pelo nome de usuário 
            cursor.execute("SELECT id FROM usuarios WHERE usuario = %s", (usuario,))
            usuario_row = cursor.fetchone()
            usuario_id = usuario_row[0] if usuario_row else None

            # Buscar ativo_id e quantidade original pela identificação
            cursor.execute("SELECT id, quantidade FROM ativos WHERE identificacao = %s", (identification,))
            ativo_row = cursor.fetchone()
            ativo_id = ativo_row[0] if ativo_row else None
            quantidade_original = ativo_row[1] if ativo_row else None

            if not usuario_id or not ativo_id or quantidade_original is None:
                return jsonify({"error": "Usuário ou ativo não encontrado"}), 400

            # Calcular quantidade movimentada
            quantidade_movimentada = abs(int(new_quantity) - int(quantidade_original))

            if quantidade_movimentada == 0:
                return jsonify({"error": "Nenhuma movimentação detectada"}), 400

            # Buscar o maior numero já existente e gerar o próximo
            cursor.execute("SELECT numero FROM entradas_saidas ORDER BY id DESC LIMIT 1")
            last_num_row = cursor.fetchone()
            if last_num_row and last_num_row[0]:
                try:
                    last_num = int(last_num_row[0].replace('#', ''))
                except Exception:
                    last_num = 0
            else:
                last_num = 0
            next_num = f"#{last_num + 1:04d}"

            cursor.execute(
                "INSERT INTO entradas_saidas (numero, data, status, usuario_id, ativo_id, movimentacao, quantidade) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (next_num, now, 'Pendente', usuario_id, ativo_id, movimentacao, quantidade_movimentada)
            )
            conn.commit()

            # Buscar o id do chamado recém criado
            cursor.execute("SELECT id FROM entradas_saidas WHERE numero = %s", (next_num,))
            entradas_saidas_row = cursor.fetchone()
            entradas_saidas_id = entradas_saidas_row[0] if entradas_saidas_row else None

            # Enviar email de notificação
            try:
                send_email(
                    usuario_id=usuario_id,
                    numero=next_num,
                    titulo=f"SOLICITAÇÃO DE {movimentacao.upper()} SUPERVISIONADA",
                    data_atual=now,
                    entradas_saidas_id=entradas_saidas_id,
                    status='Pendente',
                    ativo=nome,
                    movimentacao=movimentacao,
                    quantidade=quantidade_movimentada,
                    nome_usuario=nome_usuario
                )
            except Exception as e:
                print(f"Erro ao enviar email: {e}")

            log_message = (
                f"[{now}] "
                f"Usuário: {usuario}, Nome: {nome_usuario}, Movimentação: Solicitação de {movimentacao} supervisionada no ativo {nome}, Identificação: {identification} "
            )
            with open('/home/usshd/estoque_ti/estoqueti_backend/logs.log', 'a') as log_file:
                log_file.write(log_message + '\n')

            return jsonify({"message": "Solicitação de movimentação supervisionada registrada com sucesso", "ativo_id": identification}), 200
        else:
            # Verifica limite de alerta antes de atualizar a quantidade
            cursor.execute(
                "SELECT nome, est_alerta, quantidade FROM ativos WHERE identificacao = %s",
                (identification,)
            )
            ativo_row = cursor.fetchone()
            nome_ativo = ativo_row[0] if ativo_row else nome
            est_alerta = ativo_row[1] if ativo_row else None
            quantidade_atual = ativo_row[2] if ativo_row else None

            # Atualiza a quantidade na tabela ativos
            cursor.execute(
                "UPDATE ativos SET quantidade = %s WHERE identificacao = %s",
                (new_quantity, identification)
            )
            conn.commit()

            # Envia alerta se necessário
            if est_alerta is not None and int(new_quantity) <= int(est_alerta):
                try:
                    send_alerta_estoque(
                        nome=nome_ativo,
                        identificacao=identification,
                        quantidade=new_quantity,
                        est_alerta=est_alerta,
                        nome_usuario=nome_usuario
                    )
                except Exception as e:
                    print(f"Erro ao enviar alerta de estoque: {e}")

            # Adicionar entrada no log
            log_message = (
                f"[{datetime.now().strftime('%d/%m/%Y %Hh%M')}] "
                f"Usuário: {usuario}, Nome: {nome_usuario}, Movimentação: {movimentacao} no ativo {nome}, Identificação: {identification} "
            )
            with open('/home/usshd/estoque_ti/estoqueti_backend/logs.log', 'a') as log_file:
                log_file.write(log_message + '\n')

            return jsonify({"message": "Quantidade atualizada com sucesso"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        close_connection(conn)