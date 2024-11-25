# app.py
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models.book import db
from models.user import User
from routes.book_routes import book_bp
from routes.user_routes import user_bp
from sqlalchemy_utils import create_database, database_exists
import os
from routes.checkout_routes import checkout_bp

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    app.config.from_object(Config)
    app.config['UPLOAD_FOLDER'] = 'uploads'
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    db.init_app(app)
    JWTManager(app)

    with app.app_context():
        db_url = app.config['SQLALCHEMY_DATABASE_URI']
        if not database_exists(db_url):
            create_database(db_url)
        db.create_all()
        init_db()

    app.register_blueprint(book_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(checkout_bp)

    return app

def init_db():
    from models.book import Book
    
    # Check if the database is empty
    if Book.query.count() == 0:
        # Add sample books
        sample_books = [
            Book(
                title="To Kill a Mockingbird",
                author="Harper Lee",
                isbn="9780446310789",
                image_url="/images/km.jpg",
                text_viewer="Sample text for To Kill a Mockingbird"
            ),
            Book(
                title="1984",
                author="George Orwell",
                isbn="9780451524935",
                image_url="/images/1984.jpg",
                text_viewer="Sample text for 1984"
            ),
            Book(
                title="Pride and Prejudice",
                author="Jane Austen",
                isbn="9780141439518",
                image_url="/images/pp.jpg",
                text_viewer="Sample text for Pride and Prejudice"
            ),
            Book(
                title="Deep Learning",
                author="Ian Goodfellow, Yoshua Bengio, Aaron Courville",
                isbn="978-0262035613",
                image_url="/images/dl.jpg",
                text_viewer="Sample text for Pride and Prejudice"
            ),
            Book(
                title="Pattern Recongnistion and Machine learning",
                author="Christopher M. Bishop",
                isbn="978-0387310732",
                image_url="/images/Ml.jpg",
                text_viewer="Basics of pattern recognition and machine learning."
            )
        ]

        db.session.add_all(sample_books)
        db.session.commit()
        print("Sample books added to the database.")
    else:
        print("Database already contains books. Skipping initialization.")

    # Add initial admin user if not exists
    if not User.query.filter_by(username='admin').first():
        admin = User(username='admin', email='admin@example.com', password='adminpassword', user_type='admin')
        db.session.add(admin)
        db.session.commit()
        print("Admin user created.")

if __name__ == '__main__':
    app = create_app()
    app.run(port=8000,debug=False)