# app.py
from flask import Flask
from config import Config
from models.book import db
from routes.book_routes import book_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    with app.app_context():
        db.create_all()

    app.register_blueprint(book_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)