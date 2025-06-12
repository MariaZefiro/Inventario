import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

list_notebooks_bp = Blueprint('list_notebooks', __name__)

@list_notebooks_bp.route('/list_notebooks', methods=['GET'])
def list_notebooks():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        cursor = conn.cursor()
        query = """
            SELECT 
                a.id AS ativo_id,
                a.nome,
                a.categoria_id,
                a.quantidade,
                a.descricao,
                a.identificacao,
                a.estado,
                a.local,
                a.serial,
                nb.processador,
                nb.memoria_ram,
                nb.armazenamento,
                nb.tamanho_tela,
                nb.bateria,
                a.supervisionado
            FROM ativos a
            LEFT JOIN notebooks nb ON a.id = nb.ativo_id
            WHERE a.categoria_id = 11
            ORDER BY a.id;
        """
        cursor.execute(query)
        notebooks = cursor.fetchall()

        return jsonify(notebooks), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar notebooks"}), 500
    finally:
        close_connection(conn)
