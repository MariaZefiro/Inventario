import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

list_movimentacao_bp = Blueprint('list_movimentacao', __name__)

@list_movimentacao_bp.route('/list_movimentacao', methods=['GET'])
def list_movimentacao():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        cursor = conn.cursor()
        query = """
            SELECT 
                es.id,
                es.numero,
                es.data,
                es.status,
                es.movimentacao,
                es.quantidade,
                u.id as usuario_id,
                u.usuario as usuario_login,
                u.nome as usuario_nome,
                a.id as ativo_id,
                a.nome as ativo_nome,
                a.descricao as ativo_descricao
            FROM entradas_saidas es
            JOIN usuarios u ON es.usuario_id = u.id
            JOIN ativos a ON es.ativo_id = a.id;
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        todos = [dict(zip(columns, row)) for row in rows]

        return jsonify(todos), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar todos componentes"}), 500
    finally:
        close_connection(conn)