# app.py
from datetime import timedelta
from datetime import datetime
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models.book import db
from models.user import User
from models.checkout import Checkout
from routes.book_routes import book_bp
from routes.user_routes import user_bp
from routes.metrics import admin_bp
from routes.summary_route import summary_bp
from routes.search_route import search_bp
from routes.recommendation_route import recommend_bp
from routes.checkin_route import checkin_bp
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
    app.register_blueprint(admin_bp)
    app.register_blueprint(recommend_bp)
    app.register_blueprint(summary_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(checkin_bp)

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
            text_viewer="To Kill a Mockingbird is a 1961 novel by Harper Lee. Set in small-town Alabama, the novel is a bildungsroman, or coming-of-age story, and chronicles the childhood of Scout and Jem Finch as their father Atticus defends a Black man falsely accused of rape. Scout and Jem are mocked by classmates for this.",
            category="Fiction"
        ),
        Book(
            title="1984",
            author="George Orwell",
            isbn="9780451524935",
            image_url="/images/1984.jpg",
            text_viewer="1984 is a dystopian novel that was written by George Orwell and published in 1949. It tells the story of Winston Smith, a citizen of the miserable society of Oceania, who is trying to rebel against the Party and its omnipresent symbol, Big Brother.",
            category="Dystopian"
        ),
        Book(
            title="Pride and Prejudice",
            author="Jane Austen",
            isbn="9780141439518",
            image_url="/images/pp.jpg",
            text_viewer="Pride and Prejudice follows the turbulent relationship between Elizabeth Bennet, the daughter of a country gentleman, and Fitzwilliam Darcy, a rich aristocratic landowner. They must overcome the titular sins of pride and prejudice in order to fall in love and marry.",
            category="Romance"
        ),
        Book(
            title="Deep Learning",
            author="Ian Goodfellow, Yoshua Bengio, Aaron Courville",
            isbn="978-0262035613",
            image_url="/images/dl.jpg",
            text_viewer="This book introduces a broad range of topics in deep learning. The text offers mathematical and conceptual background, covering relevant concepts in linear algebra, probability theory and information theory, numerical computation, and machine learning.",
            category="Education"
        ),
        Book(
            title="Pattern Recognition and Machine Learning",
            author="Christopher M. Bishop",
            isbn="978-0387310732",
            image_url="/images/Ml.jpg",
            text_viewer="This is the first textbook on pattern recognition to present the Bayesian viewpoint. The book presents approximate inference algorithms that permit fast approximate answers in situations where exact answers are not feasible. It uses graphical models to describe probability distributions when no other books apply graphical models to machine learning. No previous knowledge of pattern recognition or machine learning concepts is assumed. Familiarity with multivariate calculus and basic linear algebra is required, and some experience in the use of probabilities would be helpful though not essential as the book includes a self-contained introduction to basic probability theory.",
            category="Education"
        )
    ]

        

        db.session.add_all(sample_books)
        db.session.commit()
        print("Sample books added to the database.")

        # Sample Users
        users = [
            User(username="Alice Johnson", email="alice@example.com", password="1234", user_type='member'),
            User(username="Bob Smith", email="bob@example.com", password="1234", user_type='member'),
            User(username="Charlie Brown", email="charlie@example.com", password="1234", user_type='member'),
            User(username='admin', email='admin@example.com', password='adminpassword', user_type='admin')
        ]

        # Commit users and books first
        db.session.add_all(users)
        db.session.commit()

        # Sample Checkouts (ensure user IDs match those inserted)
        checkouts = [
            Checkout(user_id=1, book_id=1, checkout_date=datetime.now() - timedelta(days=15), due_date=datetime.now() - timedelta(days=5), status='checked_out'),
            Checkout(user_id=2, book_id=2, checkout_date=datetime.now() - timedelta(days=10), due_date=datetime.now() + timedelta(days=5), status='checked_out'),
            Checkout(user_id=3, book_id=3, checkout_date=datetime.now() - timedelta(days=20), due_date=datetime.now() - timedelta(days=10), status='checked_out')
        ]

        # Add checkouts after users and books are committed
        db.session.add_all(checkouts)
        db.session.commit()

if __name__ == '__main__':
    app = create_app()
    app.run(port=8000,debug=False)