# routes/book_routes.py
from flask import Blueprint, jsonify, request
from models.book import Book, db

book_bp = Blueprint('book_bp', __name__)

@book_bp.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify([book.title for book in books])

@book_bp.route('/books', methods=['POST'])
def add_book():
    data = request.json
    new_book = Book(title=data['title'], author=data['author'])
    db.session.add(new_book)
    db.session.commit()
    return jsonify({'message': 'Book added successfully'}), 201