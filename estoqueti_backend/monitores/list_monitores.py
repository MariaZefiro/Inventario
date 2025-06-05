import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

list_monitores_bp = Blueprint('list_monitores', __name__)

@list_monitores_bp.route('/list_monitores', methods=['GET'])
def list_monitores():
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
                mn.tamanho_polegadas,
                mn.resolucao,
                mn.tipo_painel,
                mn.taxa_atualizacao,
                mn.conexoes,
                a.supervisionado
            FROM ativos a
            INNER JOIN monitores mn ON a.id = mn.ativo_id;
        """
        cursor.execute(query)
        monitores = cursor.fetchall()

        return jsonify(monitores), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar monitores"}), 500
    finally:
        close_connection(conn)
