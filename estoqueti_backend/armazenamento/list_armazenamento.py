import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

list_armazenamento_bp = Blueprint('list_armazenamento', __name__)

@list_armazenamento_bp.route('/list_armazenamento', methods=['GET'])
def list_armazenamento():
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
                am.tipo,
                am.capacidade,
                am.interface,
                a.supervisionado
            FROM ativos a
            LEFT JOIN armazenamento am ON a.id = am.ativo_id
            WHERE a.categoria_id = 2
            ORDER BY a.id;
        """
        cursor.execute(query)
        armazenamento = cursor.fetchall()

        return jsonify(armazenamento), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar armazenamento"}), 500
    finally:
        close_connection(conn)
