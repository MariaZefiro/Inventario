import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

list_all_bp = Blueprint('list_all', __name__)

@list_all_bp.route('/list_all', methods=['GET'])
def list_all():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        cursor = conn.cursor()
        query = """
            SELECT * FROM ativos;
        """
        cursor.execute(query)
        todos = cursor.fetchall()

        return jsonify(todos), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar todos componentes"}), 500
    finally:
        close_connection(conn)

@list_all_bp.route('/list_all_sup', methods=['GET'])
def list_all_sup():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        cursor = conn.cursor()
        query = """
            SELECT a.*, c.nome as categoria_nome
            FROM ativos a
            LEFT JOIN categorias c ON a.categoria_id = c.id;
        """
        cursor.execute(query)
        columns = [col[0] for col in cursor.description]
        todos = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return jsonify(todos), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar todos componentes"}), 500
    finally:
        close_connection(conn)
