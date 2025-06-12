from imports import *
from config import app_ip

app = Flask(__name__)
CORS(app)

@app.before_request
def validate_origin():
    # Validação de origem para todas as outras requisições
    origin = request.headers.get("Origin")
    if origin not in ALLOWED_ORIGINS:
        # Permitir uploads de imagens e códigos de barras mesmo para origens não permitidas
        if not (request.path.startswith('/uploads/feedback_images/') or request.path.startswith('/barcodes/')):
            abort(403)  # Bloqueia requisições de origens não permitidas

# Registrar Blueprints após a criação do app
for blueprint in blueprints:
    app.register_blueprint(blueprint, url_prefix='/api')

# Rota para servir arquivos de imagem
@app.route('/uploads/feedback_images/<path:filename>')
def upload_file(filename):
    image_dir = os.path.join(app.root_path, 'uploads', 'feedback_images')
    return send_from_directory(image_dir, filename)

# Rota para servir arquivos de imagem do código de barra
@app.route('/barcodes/<path:filename>', methods=['GET'])
def serve_barcode(filename):
    BARCODE_DIR = os.path.join(os.path.dirname(__file__), 'barcodes')
    barcode_path = os.path.join(BARCODE_DIR, filename)
    return send_from_directory(BARCODE_DIR, filename)

if __name__ == '__main__':
    app.run(host=app_ip, debug=True, port=5000)