import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection
from datetime import datetime

delete_ativo_bp = Blueprint('delete_ativo', __name__)

@delete_ativo_bp.route('/delete_ativo', methods=['POST'])
def delete_ativo():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        data = request.json
        ativo_id = data.get('ativo_id')
        usuario = data.get('user')
        nome_usuario = data.get('nome')

        # Verificar se o ativo existe
        cursor = conn.cursor()
        cursor.execute("SELECT nome, identificacao FROM ativos WHERE id = %s", (ativo_id,))
        ativo = cursor.fetchone()
        if not ativo:
            return jsonify({"error": "Ativo não encontrado"}), 404

        nome_ativo, identificacao = ativo

        # Deletar o ativo da tabela principal
        cursor.execute("DELETE FROM ativos WHERE id = %s", (ativo_id,))

        # Remover o arquivo de código de barras, se existir
        barcode_dir = os.path.join(os.path.dirname(__file__), '..', 'barcodes')
        barcode_path = os.path.join(barcode_dir, f"{identificacao}.png")
        
        if os.path.exists(barcode_path):
            os.remove(barcode_path)
     
        # Adicionar entrada no log
        log_message = (
            f"[{datetime.now().strftime('%d/%m/%Y %Hh%M')}] "
            f"Usuário: {usuario}, Nome: {nome_usuario}, Movimentação: Deletou o ativo {nome_ativo}, Identificação: {identificacao} "
        )
        with open('/home/usshd/estoque_ti/estoqueti_backend/logs.log', 'a') as log_file:
            log_file.write(log_message + '\n')

        conn.commit()
        return jsonify({"message": "Ativo deletado com sucesso", "ativo_id": identificacao}), 200

    except Exception as e:
        conn.rollback()
        print(e)
        return jsonify({"error": f"Erro ao deletar ativo: {str(e)}"}), 500
    finally:
        close_connection(conn)
