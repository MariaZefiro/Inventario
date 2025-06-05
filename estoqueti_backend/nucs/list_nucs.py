import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

list_nucs_bp = Blueprint('list_nucs', __name__)

@list_nucs_bp.route('/list_nucs', methods=['GET'])
def list_nucs():
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
                nc.processador,
                nc.memoria_ram,
                nc.armazenamento,
                a.supervisionado
            FROM ativos a
            INNER JOIN nucs nc ON a.id = nc.ativo_id;
        """
        cursor.execute(query)
        nucs = cursor.fetchall()

        return jsonify(nucs), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar nucs"}), 500
    finally:
        close_connection(conn)
