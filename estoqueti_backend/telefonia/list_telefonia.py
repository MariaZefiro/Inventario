import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

list_telefonia_bp = Blueprint('list_telefonia', __name__)

@list_telefonia_bp.route('/list_telefonia', methods=['GET'])
def list_telefonia():
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
                tf.tipo,
                tf.tecnologia,
                tf.compatibilidade,
                a.supervisionado
            FROM ativos a
            INNER JOIN telefonia tf ON a.id = tf.ativo_id;
        """
        cursor.execute(query)
        telefonia = cursor.fetchall()

        return jsonify(telefonia), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar telefonia"}), 500
    finally:
        close_connection(conn)
