# routes/book_routes.py
from flask import Blueprint, jsonify, request, current_app
from models.book import Book
from models.user import User
from models import db
from sqlalchemy import or_
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
from werkzeug.utils import secure_filename
import os

book_bp = Blueprint('book_bp', __name__)

def admin_required(func):
    @wraps(func)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        if not current_user or current_user.user_type != 'admin':
            return jsonify({'message': 'Admin access required'}), 403
        return func(*args, **kwargs)
    return decorated_function

@book_bp.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify([book.to_dict() for book in books])



@book_bp.route('/books', methods=['POST'])
@admin_required
def add_book():
    # Check if the post request has the file part
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']
    
    # If the user does not select a file, the browser submits an empty file without a filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Get other book data from form data
        title = request.form.get('title')
        author = request.form.get('author')
        isbn = request.form.get('isbn')
        text_viewer = request.form.get('text_viewer')
        
        # Create new book object
        new_book = Book(
            title=title,
            author=author,
            isbn=isbn,
            image_url=f"/images/{filename}",  # Store the relative path
            text_viewer=text_viewer
        )
        
        db.session.add(new_book)
        db.session.commit()
        
        return jsonify({'message': 'Book added successfully', 'book': new_book.to_dict()}), 201
    
    return jsonify({'error': 'Invalid file type'}), 400

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@book_bp.route('/books/<int:book_id>', methods=['PUT'])
@admin_required
def update_book(book_id):
    book = Book.query.get_or_404(book_id)
    data = request.json
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.isbn = data.get('isbn', book.isbn)
    book.image_url = data.get('image_url', book.image_url)
    book.text_viewer = data.get('text_viewer', book.text_viewer)
    db.session.commit()
    return jsonify({'message': 'Book updated successfully', 'book': book.to_dict()})

@book_bp.route('/books/<int:book_id>', methods=['DELETE'])
@admin_required
def delete_book(book_id):
    book = Book.query.get_or_404(book_id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({'message': 'Book deleted successfully'})

@book_bp.route('/search', methods=['GET'])
def search_books():
    query = request.args.get('query', '')
    category = request.args.get('category', 'books')

    if category != 'books':
        return jsonify({'message': f'Search in {category} is not implemented yet'}), 501

    results = Book.query.filter(
        or_(
            Book.title.ilike(f'%{query}%'),
            Book.author.ilike(f'%{query}%'),
            Book.isbn.ilike(f'%{query}%')
        )
    ).all()

    return jsonify([book.to_dict() for book in results])