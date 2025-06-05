import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

edit_usuarios_bp = Blueprint('edit_usuarios', __name__)

@edit_usuarios_bp.route('/edit_usuario', methods=['POST'])
def edit_usuario():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        data = request.get_json()
        user_id = data.get('id')
        novo_admin = data.get('isAdmin')
        novo_cargo = data.get('cargo')

        cursor = conn.cursor()
        if novo_admin is not None and novo_cargo is not None:
            query = "UPDATE usuarios SET isAdmin=%s, cargo=%s WHERE id=%s"
            cursor.execute(query, (novo_admin, novo_cargo, user_id))
        elif novo_admin is not None:
            query = "UPDATE usuarios SET isAdmin=%s WHERE id=%s"
            cursor.execute(query, (novo_admin, user_id))
        elif novo_cargo is not None:
            query = "UPDATE usuarios SET cargo=%s WHERE id=%s"
            cursor.execute(query, (novo_cargo, user_id))
        else:
            return jsonify({"error": "Nenhum campo para atualizar"}), 400

        conn.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao editar usuário"}), 500
    finally:
        close_connection(conn)
