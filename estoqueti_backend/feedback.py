import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/add_feedbacks', methods=['POST'])
def add_feedbacks():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        nome = request.form.get('nome')
        feedback_name = request.form.get('feedbackName')
        mensagem = request.form.get('mensagem')
        data = request.form.get('data')
        images = request.files.getlist('images')

        if not nome or not feedback_name or not mensagem or not data:
            return jsonify({"error": "Campos obrigatórios estão faltando"}), 400

        cursor = conn.cursor()
        query = """
            INSERT INTO feedbacks (nome, feedback_name, mensagem, data)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (nome, feedback_name, mensagem, data))
        feedback_id = cursor.lastrowid  

        if images:
            image_dir = os.path.join('uploads', 'feedback_images', str(feedback_id))
            os.makedirs(image_dir, exist_ok=True)

            for image in images:
                unique_image_name = f"{feedback_id}_{image.filename}"
                image_path = os.path.join(image_dir, unique_image_name)
                image.save(image_path)

                image_query = """
                    INSERT INTO feedback_images (feedback_id, image_name)
                    VALUES (%s, %s)
                """
                cursor.execute(image_query, (feedback_id, unique_image_name))

        conn.commit()
        return jsonify({"message": "Feedback enviado com sucesso"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"Erro ao enviar feedback: {str(e)}"}), 500
    finally:
        close_connection(conn)

@feedback_bp.route('/list_feedbacks', methods=['GET'])
def list_feedbacks():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        nome = request.args.get('nome')
        if not nome:
            return jsonify({"error": "Nome do usuário não fornecido"}), 400

        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT f.id, f.nome, f.feedback_name, f.mensagem, f.data, 
                   GROUP_CONCAT(fi.image_name) AS images
            FROM feedbacks f
            LEFT JOIN feedback_images fi ON f.id = fi.feedback_id
            WHERE f.nome = %s
            GROUP BY f.id
        """
        cursor.execute(query, (nome,))
        feedbacks = cursor.fetchall()

        for feedback in feedbacks:
            if feedback['images']:
                feedback['images'] = feedback['images'].split(',')
            else:
                feedback['images'] = []

        return jsonify(feedbacks), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"Erro ao listar feedbacks do usuário: {str(e)}"}), 500
    finally:
        close_connection(conn)

@feedback_bp.route('/list_feedbacks_dev', methods=['GET'])
def list_feedbacks_dev():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT f.id, f.nome, f.feedback_name, f.mensagem, f.data, 
                   GROUP_CONCAT(fi.image_name) AS images
            FROM feedbacks f
            LEFT JOIN feedback_images fi ON f.id = fi.feedback_id
            GROUP BY f.id
        """
        cursor.execute(query)  
        feedbacks = cursor.fetchall()

        for feedback in feedbacks:
            if feedback['images']:
                feedback['images'] = feedback['images'].split(',')
            else:
                feedback['images'] = []

        return jsonify(feedbacks), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"Erro ao listar feedbacks: {str(e)}"}), 500
    finally:
        close_connection(conn)