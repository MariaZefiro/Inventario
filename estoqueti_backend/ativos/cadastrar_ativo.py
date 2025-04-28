import os
from flask import Blueprint, request, jsonify
from db import get_connection, close_connection

cadastrar_ativo_bp = Blueprint('cadastrar_ativo', __name__)

@cadastrar_ativo_bp.route('/cadastrar_ativo', methods=['POST'])
def cadastrar_ativo():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Falha na conexão com o banco de dados"}), 500

    try:
        data = request.json
        nome = data.get('name')
        categoria_id = data.get('category_id')
        quantidade = data.get('quantity')
        descricao = data.get('description')
        estado = data.get('state')
        local = data.get('local')
        specific_fields = data.get('specificFields', {})

        # Verificar o último identificador para a categoria
        cursor = conn.cursor()
        cursor.execute("""
            SELECT identificacao 
            FROM ativos 
            WHERE categoria_id = %s 
            ORDER BY identificacao DESC 
            LIMIT 1
        """, (categoria_id,))
        last_id = cursor.fetchone()

        # Gerar o próximo identificador
        cursor.execute("SELECT nome FROM categorias WHERE id = %s", (categoria_id,))
        category_name = cursor.fetchone()
        if not category_name:
            return jsonify({"error": "Categoria inválida"}), 400

        prefix = category_name[0][:3].upper()
        next_number = int(last_id[0][3:]) + 1 if last_id else 1
        identificacao = f"{prefix}{str(next_number).zfill(3)}"

        # Inserir o ativo no banco de dados
        cursor.execute("""
            INSERT INTO ativos (nome, categoria_id, quantidade, descricao, identificacao, estado, local)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (nome, categoria_id, quantidade, descricao, identificacao, estado, local))
        ativo_id = cursor.lastrowid 

        # Inserir os campos específicos na tabela correspondente
        if specific_fields:
            if categoria_id == 1:  # Adaptadores
                cursor.execute("""
                    INSERT INTO adaptadores (ativo_id, tipo, conexao_entrada, conexao_saida)
                    VALUES (%s, %s, %s, %s)
                """, (ativo_id, specific_fields.get('Tipo'), specific_fields.get('Conexão Entrada'), specific_fields.get('Conexão Saída')))
            elif categoria_id == 2:  # Armazenamento
                cursor.execute("""
                    INSERT INTO armazenamento (ativo_id, tipo, capacidade, interface)
                    VALUES (%s, %s, %s, %s)
                """, (ativo_id, specific_fields.get('Tipo'), specific_fields.get('Capacidade'), specific_fields.get('Interface')))
            elif categoria_id == 3:  # Cabos
                cursor.execute("""
                    INSERT INTO cabos (ativo_id, tipo, comprimento, material)
                    VALUES (%s, %s, %s, %s)
                """, (ativo_id, specific_fields.get('Tipo'), specific_fields.get('Comprimento'), specific_fields.get('Material')))
            elif categoria_id == 5:  # Desktop/AIO
                cursor.execute("""
                    INSERT INTO desktops (ativo_id, processador, memoria_ram, armazenamento, fonte_alimentacao)
                    VALUES (%s, %s, %s, %s, %s)
                """, (ativo_id, specific_fields.get('Processador'), specific_fields.get('Memória RAM'), specific_fields.get('Armazenamento'), specific_fields.get('Fonte Alimentação')))
            elif categoria_id == 7:  # Fontes
                cursor.execute("""
                    INSERT INTO fontes (ativo_id, potencia_watts, modular)
                    VALUES (%s, %s, %s)
                """, (ativo_id, specific_fields.get('Potência Watts'), specific_fields.get('Modular')))

        conn.commit()

        return jsonify({"message": "Ativo cadastrado com sucesso", "identificacao": identificacao}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"Erro ao cadastrar ativo: {str(e)}"}), 500
    finally:
        close_connection(conn)

# +--------------------+
# | Tables_in_estoque  |
# +--------------------+
# | adaptadores         | F
# | armazenamento       | F
# | ativos              | F
# | cabos               | F
# | categorias          | F
# | desktops            | F
# | fontes              | F
# | memorias_ram       |
# | monitores          |
# | notebooks          |
# | nucs               |
# | perifericos        |
# | redes              |
# | telefonia          |
# | usuarios           |
# | usuarios_sem_senha |
# +--------------------+

# mysql> select * from categorias;
# +----+----------------------+
# | id | nome                 |
# +----+----------------------+
# |  1 | Adaptador            |
# |  2 | Armazenamento        |
# |  3 | Cabos                |
# |  4 | Componentes diversos |
# |  5 | Desktop/AIO          |
# |  6 | Ferramentas          |
# |  7 | Fontes               |
# |  8 | Insumos              |
# |  9 | Memória RAM          |
# | 10 | Monitor              |
# | 11 | Notebook             |
# | 12 | NUC                  |
# | 13 | Periféricos          |
# | 14 | Redes                |
# | 15 | Telefonia            |
# +----+----------------------+
