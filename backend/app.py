from flask import Flask, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv


load_dotenv()


from routes_overlay import overlay_bp
from config import STREAM_OUTPUT_DIR


app = Flask(__name__)
CORS(app)  # ✅ allow all origins


app.register_blueprint(overlay_bp, url_prefix="/api/overlays")


# Serve HLS playlist and ts files from STREAM_OUTPUT_DIR under /stream/<path>
@app.route('/stream/<path:filename>')
def stream_file(filename):
    return send_from_directory(STREAM_OUTPUT_DIR, filename)


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)