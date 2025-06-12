import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

list_perifericos_bp = Blueprint('list_perifericos', __name__)

@list_perifericos_bp.route('/list_perifericos', methods=['GET'])
def list_perifericos():
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
                pf.tipo,
                pf.conexao,
                pf.marca,
                a.supervisionado
            FROM ativos a
            LEFT JOIN perifericos pf ON a.id = pf.ativo_id
            WHERE a.categoria_id = 13
            ORDER BY a.id;
        """
        cursor.execute(query)
        perifericos = cursor.fetchall()

        return jsonify(perifericos), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar periféricos"}), 500
    finally:
        close_connection(conn)
