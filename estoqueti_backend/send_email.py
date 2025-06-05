import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import uuid  
from config import sender_email, sender_password, recipient_email, domain, url_sistema, zmail
from db import get_connection, close_connection

def send_email(usuario_id, numero, titulo, data_atual, entradas_saidas_id, status, ativo, movimentacao, quantidade, nome_usuario):
        # Gera um Message-ID único
        message_id = f"<{uuid.uuid4()}@{domain}>"

        conn = get_connection()
        cursor = conn.cursor()
        query = """
        UPDATE entradas_saidas SET email_id=%s WHERE id=%s;
        """
        cursor.execute(query, (message_id, entradas_saidas_id))
        conn.commit()
        close_connection(conn)

        subject = f"{titulo}"
        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4;">
                <div style="margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <header style="border-bottom: 2px solid #0b6bcb; padding-bottom: 15px; margin-bottom: 20px;">
                        <h2 style="color: #0b6bcb; font-size: 24px; text-align: center; margin: 0;">Nova {movimentacao} Solicitada</h2>
                    </header>
                    <p>Prezado(a),</p>
                    <p>Informamos que uma nova {movimentacao} foi solicitada por <strong>{nome_usuario}</strong> com os seguintes detalhes:</p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr style="background-color: #f9f9f9;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Número:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">{numero}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Status:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">{status}</td>
                        </tr>
                        <tr style="background-color: #f9f9f9;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Ativo:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">{ativo}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Movimentação:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">{movimentacao}</td>
                        </tr>
                        <tr style="background-color: #f9f9f9;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Quantidade:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">{quantidade}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Data:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">{data_atual}</td>
                        </tr>
                    </table>
                    <p>Para mais informações, acesse o sistema clicando no link abaixo:</p>
                    <p style="text-align: center;">
                        <a href="{url_sistema}" style="color: #0b6bcb; text-decoration: none; font-weight: bold;">Acessar Inventário</a>
                    </p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <footer style="text-align: center; font-size: 0.9em; color: #555;">
                        <p>Este é um e-mail automático. Por favor, não responda.</p>
                        <p style="margin: 0;">&copy; 2025 Sistema de Inventário | Setor TI</p>
                    </footer>
                </div>
            </body>
        </html>
        """

        try:
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = recipient_email
            msg['Subject'] = subject
            msg['Message-ID'] = message_id
            msg.attach(MIMEText(body, 'html'))  

            with smtplib.SMTP(zmail, 587) as server:
                server.starttls()
                server.login(sender_email, sender_password)
                server.sendmail(sender_email, [recipient_email], msg.as_string())  
        except Exception as e:
            print(f"Erro ao enviar e-mail: {e}")

def send_alerta_estoque(nome, identificacao, quantidade, est_alerta, nome_usuario):
    subject = f"ALERTA DE ESTOQUE BAIXO: {nome.upper()} ({identificacao})"
    body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4;">
            <div style="margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <header style="border-bottom: 2px solid #b30000; padding-bottom: 15px; margin-bottom: 20px;">
                    <h2 style="color: #b30000; font-size: 24px; text-align: center; margin: 0;">ALERTA DE ESTOQUE BAIXO</h2>
                </header>
                <p>Prezado(a),</p>
                <p>
                    O ativo <strong style="color:#0b6bcb;">{nome.upper()}</strong> 
                    <span style="color:#888;">(ID: #{identificacao})</span> atingiu o limite de alerta de estoque.
                </p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; border: 1px solid #ddd; width: 50%;"><strong>Quantidade atual:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd; width: 50%;">{quantidade}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; width: 50%;"><strong>Limite de alerta:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd; width: 50%;">{est_alerta}</td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; border: 1px solid #ddd; width: 50%;"><strong>Usuário responsável pela última movimentação:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd; width: 50%;">{nome_usuario}</td>
                    </tr>
                </table>
                <p style="color:#b30000; font-weight:bold;">Verifique a necessidade de reposição deste item!</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <footer style="text-align: center; font-size: 0.9em; color: #555;">
                    <p>Este é um e-mail automático. Por favor, não responda.</p>
                    <p style="margin: 0;">&copy; 2025 Sistema de Inventário | Setor TI</p>
                </footer>
            </div>
        </body>
    </html>
    """
    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))
        with smtplib.SMTP(zmail, 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, [recipient_email], msg.as_string())
    except Exception as e:
        print(f"Erro ao enviar alerta de estoque: {e}")