# routes/book_routes.py
from flask import Blueprint, jsonify, request, current_app, send_from_directory
from models.book import Book
from models.user import User
from models import db
from sqlalchemy import or_
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
from models.checkout import Checkout
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
    books_data = []
    for book in books:
        book_dict = book.to_dict()
        if book_dict['image_url']:
            # Convert relative path to full URL
            book_dict['image_url'] = f"http://localhost:8000{book_dict['image_url']}"
        books_data.append(book_dict)
    return jsonify(books_data)



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
        category = request.form.get('category')
        text_viewer = request.form.get('text_viewer')
        
        # Create new book object
        new_book = Book(
            title=title,
            author=author,
            isbn=isbn,
            category=category,
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

@book_bp.route('/books/<int:book_id>', methods=['GET'])
def get_books_id(book_id):
    book = Book.query.get_or_404(book_id)
    
    book_dict = book.to_dict()
    if book_dict['image_url']:
        # Convert relative path to full URL
        book_dict['image_url'] = f"http://localhost:8000{book_dict['image_url']}"
    return jsonify(book_dict)

@book_bp.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)

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

    books_data = []
    for book in results:
        book_dict = book.to_dict()
        if book_dict['image_url']:
            # Convert relative path to full URL
            book_dict['image_url'] = f"http://localhost:8000{book_dict['image_url']}"
        books_data.append(book_dict)

    return jsonify(books_data)



@book_bp.route('/books/<int:book_id>/available-dates', methods=['GET', 'POST'])
def handle_available_dates(book_id):
    book = Book.query.get_or_404(book_id)
    
    if request.method == 'GET':
        # Get current date and 3 months from now
        today = datetime.now().date()
        three_months = today + timedelta(days=90)
        
        # Get all checkouts and reservations for this book
        checkouts = Checkout.query.filter(
            Checkout.book_id == book_id,
            Checkout.status.in_(['checked_out', 'reserved'])
        ).all()
        
        # Get all dates that are unavailable
        unavailable_dates = set()
        for checkout in checkouts: 
            current_date = checkout.checkout_date.date()
            while current_date <= checkout.due_date.date():
                unavailable_dates.add(current_date.isoformat())
                current_date += timedelta(days=1)
        
        # Generate all dates in the 3-month period
        available_dates = []
        current = today
        while current <= three_months:
            if current.isoformat() not in unavailable_dates:
                available_dates.append(current.isoformat())
            current += timedelta(days=1)
        

        return jsonify({
            'book_id': book_id,
            'available_dates': available_dates
        })
    
    elif request.method == 'POST':
        user_id = get_jwt_identity()
        data = request.get_json()
        selected_date = datetime.fromisoformat(data.get('date').replace('Z', '+00:00'))
        
        # Validate selected date
        if selected_date.date() < datetime.now().date():
            return jsonify({'error': 'Cannot reserve for past dates'}), 400
            
        if selected_date.date() > datetime.now().date() + timedelta(days=90):
            return jsonify({'error': 'Cannot reserve more than 3 months in advance'}), 400
            
        # Check if date is available
        existing_checkout = Checkout.query.filter(
            Checkout.book_id == book_id,
            Checkout.checkout_date <= selected_date,
            Checkout.due_date >= selected_date,
            Checkout.status.in_(['checked_out', 'reserved'])
        ).first()
        
        if existing_checkout:
            return jsonify({'error': 'Selected date is not available'}), 400
            
        # Create reservation
        reservation = Checkout(
            user_id=user_id,
            book_id=book_id,
            checkout_date=selected_date,
            due_date=selected_date + timedelta(days=14),
            status='reserved'
        )
        
        db.session.add(reservation)
        db.session.commit()
        
        return jsonify({
            'message': 'Book reserved successfully',
            'reservation': reservation.to_dict()
        }), 201

@book_bp.route('/books/<int:book_id>/checkouts')
def get_book_checkouts(book_id):
    # Get the book
    book = Book.query.get_or_404(book_id)
    
    # Get all checkouts for this book
    checkouts = Checkout.query.filter_by(book_id=book_id).all()
    
    return jsonify({
        'book_id': book_id,
        'checkouts': [checkout.to_dict() for checkout in checkouts],
        'total_copies': book.available_copies
    })