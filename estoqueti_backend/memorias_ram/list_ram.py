import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

list_ram_bp = Blueprint('list_ram', __name__)

@list_ram_bp.route('/list_ram', methods=['GET'])
def list_ram():
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
                mr.capacidade,
                mr.tipo,
                mr.frequencia,
                mr.latencia,
                a.supervisionado
            FROM ativos a
            LEFT JOIN memorias_ram mr ON a.id = mr.ativo_id
            WHERE a.categoria_id = 9
            ORDER BY a.id;
        """
        cursor.execute(query)
        ram = cursor.fetchall()

        return jsonify(ram), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar memória ram"}), 500
    finally:
        close_connection(conn)
