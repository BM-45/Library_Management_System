from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.checkout import Checkout
from models.book import Book
from models.user import User
from models import db
from datetime import datetime, timedelta

checkout_bp = Blueprint('checkout_bp', __name__)

@checkout_bp.route('/checkout/<int:book_id>', methods=['POST'])
@jwt_required()
def checkout_book(book_id):
    user_id = get_jwt_identity()
    
    # Check if book exists and is available
    book = Book.query.get_or_404(book_id)
    if book.available_copies <= 0:
        return jsonify({
            'error': 'Book is not available',
            'available_dates': get_available_dates(book_id)
        }), 400
    
    # Check if user already has this book checked out
    existing_checkout = Checkout.query.filter_by(
        user_id=user_id,
        book_id=book_id,
        status='checked_out'
    ).first()
    
    if existing_checkout:
        return jsonify({'error': 'You already have this book checked out'}), 400
    
    # Create new checkout
    checkout = Checkout(
        user_id=user_id,
        book_id=book_id,
        checkout_date=datetime.utcnow(),
        due_date=datetime.utcnow() + timedelta(days=14),
        status='checked_out'
    )
    
    # Update book availability
    book.available_copies -= 1
    
    db.session.add(checkout)
    db.session.commit()
    
    return jsonify({'message': 'Book checked out successfully', 'checkout': checkout.to_dict()}), 201

@checkout_bp.route('/reserve/<int:book_id>', methods=['POST'])
@jwt_required()
def reserve_book(book_id):
    user_id = get_jwt_identity()
    reservation_date = datetime.fromisoformat(request.json.get('date').replace('Z', '+00:00'))
    
    # Validate reservation date
    if reservation_date < datetime.utcnow():
        return jsonify({'error': 'Cannot reserve for past dates'}), 400
    
    if reservation_date > datetime.utcnow() + timedelta(days=90):
        return jsonify({'error': 'Cannot reserve more than 3 months in advance'}), 400
    
    # Create reservation
    reservation = Checkout(
        user_id=user_id,
        book_id=book_id,
        checkout_date=reservation_date,
        due_date=reservation_date + timedelta(days=14),
        status='reserved'
    )
    
    db.session.add(reservation)
    db.session.commit()
    
    return jsonify({'message': 'Book reserved successfully', 'reservation': reservation.to_dict()}), 201

@checkout_bp.route('/return/<int:book_id>', methods=['POST'])
@jwt_required()
def return_book(book_id):
    user_id = get_jwt_identity()
    
    checkout = Checkout.query.filter_by(
        user_id=user_id,
        book_id=book_id,
        status='checked_out'
    ).first_or_404()
    
    checkout.status = 'returned'
    checkout.returned_date = datetime.utcnow()
    
    book = Book.query.get(book_id)
    book.available_copies += 1
    
    db.session.commit()
    
    return jsonify({'message': 'Book returned successfully'})

@checkout_bp.route('/checkouts', methods=['GET'])
@jwt_required()
def get_user_checkouts():
    user_id = get_jwt_identity()
    checkouts = Checkout.query.filter_by(user_id=user_id, status='checked_out').all()
    return jsonify([checkout.to_dict() for checkout in checkouts])

def get_available_dates(book_id):
    # Get all checkouts for this book
    checkouts = Checkout.query.filter(
        Checkout.book_id == book_id,
        Checkout.status.in_(['checked_out', 'reserved'])
    ).all()
    
    # Calculate available dates
    unavailable_dates = set()
    for checkout in checkouts:
        current_date = checkout.checkout_date.date()
        while current_date <= checkout.due_date.date():
            unavailable_dates.add(current_date.isoformat())
            current_date += timedelta(days=1)
    
    # Generate available dates for next 3 months
    available_dates = []
    current = datetime.utcnow().date()
    end_date = current + timedelta(days=90)
    
    while current <= end_date:
        if current.isoformat() not in unavailable_dates:
            available_dates.append(current.isoformat())
        current += timedelta(days=1)
    
    return available_dates
