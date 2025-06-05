import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

alert_bp = Blueprint('alert', __name__)

@alert_bp.route('/alert', methods=['GET'])
def alert():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        cursor = conn.cursor()
        query = ""
        cursor.execute(query)
        todos = cursor.fetchall()

        return jsonify(todos), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar todos componentes"}), 500
    finally:
        close_connection(conn)

@alert_bp.route('/editar_ativo_alerta', methods=['POST'])
def editar_ativo_alerta():
    data = request.get_json()
    ativo_id = data.get('ativo_id')
    est_alerta = data.get('est_alerta')

    if ativo_id is None:
        return jsonify({"error": "ID do ativo não fornecido"}), 400

    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        cursor = conn.cursor()
        # Se est_alerta for None ou 0, remove o alerta (seta como NULL)
        if est_alerta is None or est_alerta == 0:
            cursor.execute("UPDATE ativos SET est_alerta = NULL WHERE id = %s", (ativo_id,))
        else:
            cursor.execute("UPDATE ativos SET est_alerta = %s WHERE id = %s", (est_alerta, ativo_id))
        conn.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao atualizar alerta"}), 500
    finally:
        close_connection(conn)