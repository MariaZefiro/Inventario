import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

list_usuarios_bp = Blueprint('list_usuarios', __name__)

@list_usuarios_bp.route('/list_usuarios', methods=['GET'])
def list_usuarios():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        cursor = conn.cursor()
        query = "SELECT id, usuario, nome, isAdmin, cargo FROM usuarios"
        cursor.execute(query)
        usuarios = cursor.fetchall()
        usuarios_dict = [
            {
                "id": row[0],
                "usuario": row[1],
                "nome": row[2],
                "isAdmin": row[3],
                "cargo": row[4]
            }
            for row in usuarios
        ]
        return jsonify(usuarios_dict), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar usuários"}), 500
    finally:
        close_connection(conn)
