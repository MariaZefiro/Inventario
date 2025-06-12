import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

list_redes_bp = Blueprint('list_redes', __name__)

@list_redes_bp.route('/list_redes', methods=['GET'])
def list_redes():
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
                rd.tipo,
                rd.velocidade,
                rd.interface,
                rd.protocolo_suportado,
                a.supervisionado
            FROM ativos a
            LEFT JOIN redes rd ON a.id = rd.ativo_id
            WHERE a.categoria_id = 14
            ORDER BY a.id;
        """
        cursor.execute(query)
        redes = cursor.fetchall()

        return jsonify(redes), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar redes"}), 500
    finally:
        close_connection(conn)
