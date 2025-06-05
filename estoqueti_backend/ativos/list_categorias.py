import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

list_categorias_bp = Blueprint('categorias', __name__)

@list_categorias_bp.route('/categorias', methods=['GET'])
def categorias():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        cursor = conn.cursor()
        query = """
            SELECT * FROM categorias;
        """
        cursor.execute(query)
        categorias = cursor.fetchall()

        return jsonify(categorias), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar categorias"}), 500
    finally:
        close_connection(conn)
