import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

list_desktops_bp = Blueprint('list_desktops', __name__)

@list_desktops_bp.route('/list_desktops', methods=['GET'])
def list_desktops():
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
                dk.processador,
                dk.memoria_ram,
                dk.armazenamento,
                dk.fonte_alimentacao,
                a.supervisionado
            FROM ativos a
            LEFT JOIN desktops dk ON a.id = dk.ativo_id
            WHERE a.categoria_id = 5
            ORDER BY a.id;
        """
        cursor.execute(query)
        desktops = cursor.fetchall()

        return jsonify(desktops), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar desktops"}), 500
    finally:
        close_connection(conn)
