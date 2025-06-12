import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

list_cabos_bp = Blueprint('list_cabos', __name__)

@list_cabos_bp.route('/list_cabos', methods=['GET'])
def list_cabos():
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
                cb.tipo,
                cb.comprimento,
                cb.material,
                a.supervisionado
            FROM ativos a
            LEFT JOIN cabos cb ON a.id = cb.ativo_id
            WHERE a.categoria_id = 3
            ORDER BY a.id;
        """
        cursor.execute(query)
        cabos = cursor.fetchall()

        return jsonify(cabos), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar cabos"}), 500
    finally:
        close_connection(conn)
