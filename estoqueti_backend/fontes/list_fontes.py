import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

list_fontes_bp = Blueprint('list_fontes', __name__)

@list_fontes_bp.route('/list_fontes', methods=['GET'])
def list_fontes():
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
                ft.potencia_watts,
                ft.modular,
                a.supervisionado
            FROM ativos a
            INNER JOIN fontes ft ON a.id = ft.ativo_id;
        """
        cursor.execute(query)
        fontes = cursor.fetchall()

        return jsonify(fontes), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar fontes"}), 500
    finally:
        close_connection(conn)
