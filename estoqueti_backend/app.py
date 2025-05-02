from imports import *

app = Flask(__name__)
CORS(app)

@app.before_request
def validate_origin():
    # Validação de origem para todas as outras requisições
    origin = request.headers.get("Origin")
    if origin not in ALLOWED_ORIGINS:
        # Permitir uploads de imagens mesmo para origens não permitidas
        if not request.path.startswith('/uploads/feedback_images/'):
            abort(403)  # Bloqueia requisições de origens não permitidas

# Registrar Blueprints após a criação do app
for blueprint in blueprints:
    app.register_blueprint(blueprint, url_prefix='/api')

# Rota para servir arquivos de imagem
@app.route('/uploads/feedback_images/<path:filename>')
def upload_file(filename):
    image_dir = os.path.join(app.root_path, 'uploads', 'feedback_images')
    return send_from_directory(image_dir, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)