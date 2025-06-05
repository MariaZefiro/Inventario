import bcrypt
from db import get_connection, close_connection

def rehash_passwords():
    conn = get_connection()
    if not conn:
        print("Falha na conexão com o banco de dados")
        return

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, senha FROM usuarios")
        users = cursor.fetchall()

        for user in users:
            user_id, old_hash = user
            new_hash = bcrypt.hashpw(old_hash.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            cursor.execute("UPDATE usuarios SET senha = %s WHERE id = %s", (new_hash, user_id))

        conn.commit()
        print("Senhas rehashadas com sucesso")
    except Exception as e:
        conn.rollback()
        print(f"Erro ao rehashar senhas: {e}")
    finally:
        close_connection(conn)


rehash_passwords()
