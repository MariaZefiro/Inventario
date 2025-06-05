import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

list_adaptadores_bp = Blueprint('list_adaptadores', __name__)

@list_adaptadores_bp.route('/list_adaptadores', methods=['GET'])
def list_adaptadores():
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
                ad.tipo,
                ad.conexao_entrada,
                ad.conexao_saida,
                a.supervisionado
            FROM ativos a
            INNER JOIN adaptadores ad ON a.id = ad.ativo_id;
        """
        cursor.execute(query)
        adaptadores = cursor.fetchall()

        return jsonify(adaptadores), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar adptadores"}), 500
    finally:
        close_connection(conn)
