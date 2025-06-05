import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

list_logs_bp = Blueprint('list_logs', __name__)

@list_logs_bp.route('/list_logs', methods=['GET'])
def list_logs():
    try:
        logs = []
        log_file_path = os.path.join(os.path.dirname(__file__), 'logs.log')
        with open(log_file_path, 'r') as log_file:
            for line in log_file:
                logs.append(line.strip())
        return jsonify(logs), 200
    except Exception as e:
        return jsonify({"error": "Erro ao listar logs"}), 500
