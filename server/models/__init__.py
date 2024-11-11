# models/__init__.py

from .book import db

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()