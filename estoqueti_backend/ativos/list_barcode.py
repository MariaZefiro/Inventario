import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

list_barcode_bp = Blueprint('list_barcode', __name__)

@list_barcode_bp.route('/list_barcode', methods=['GET'])
def list_barcode():
    identificacao = request.args.get('identificacao')
    if not identificacao:
        return jsonify({"error": "Identificação não fornecida"}), 400

    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        cursor = conn.cursor(dictionary=True) 

        category_table_mapping = {
            1: "adaptadores",
            2: "armazenamento",
            3: "cabos",
            5: "desktops",
            7: "fontes",
            9: "memorias_ram",
            10: "monitores",
            11: "notebooks",
            12: "nucs",
            13: "perifericos",
            14: "redes",
            15: "telefonia"
        }

        # Pegando todas as colunas do ativo e o nome da categoria
        query = """
            SELECT 
                a.*, 
                c.nome AS categoria_nome
            FROM ativos a
            LEFT JOIN categorias c ON a.categoria_id = c.id
            WHERE a.identificacao = %s;
        """
        cursor.execute(query, (identificacao,))
        ativo = cursor.fetchone()

        if not ativo:
            return jsonify({"error": "Ativo não encontrado"}), 404

        detalhes = None
        categoria_id = ativo["categoria_id"]

        # Verifica se a categoria tem uma tabela específica e faz a query
        if categoria_id in category_table_mapping:
            table_name = category_table_mapping[categoria_id]
            detail_query = f"""
                SELECT * FROM {table_name} WHERE ativo_id = (
                    SELECT id FROM ativos WHERE identificacao = %s
                );
            """
            cursor.execute(detail_query, (identificacao,))
            detalhes = cursor.fetchone()

        result = {
            "ativo": ativo,
            "detalhes_categoria": detalhes
        }

        return jsonify(result), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Erro ao listar ativo componentes"}), 500
    finally:
        close_connection(conn)