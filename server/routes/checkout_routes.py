from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.checkout import Checkout
from models.book import Book
from models.user import User
from models import db
from datetime import datetime

checkout_bp = Blueprint('checkout_bp', __name__)

@checkout_bp.route('/checkout/<int:book_id>', methods=['POST'])
@jwt_required()
def checkout_book(book_id):
    user_id = get_jwt_identity()
    
    # Check if book exists and is available
    book = Book.query.get_or_404(book_id)
    if book.available_copies <= 0:
        return jsonify({'error': 'Book is not available'}), 400
    
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
        book_id=book_id
    )
    
    # Update book availability
    book.available_copies -= 1
    
    db.session.add(checkout)
    db.session.commit()
    
    return jsonify({'message': 'Book checked out successfully', 'checkout': checkout.to_dict()}), 201

@checkout_bp.route('/return/<int:book_id>', methods=['POST'])
@jwt_required()
def return_book(book_id):
    user_id = get_jwt_identity()
    
    # Find the checkout record
    checkout = Checkout.query.filter_by(
        user_id=user_id,
        book_id=book_id,
        status='checked_out'
    ).first_or_404()
    
    # Update checkout status
    checkout.status = 'returned'
    checkout.returned_date = datetime.utcnow()
    
    # Update book availability
    book = Book.query.get(book_id)
    book.available_copies += 1
    
    db.session.commit()
    
    return jsonify({'message': 'Book returned successfully'})

@checkout_bp.route('/checkouts', methods=['GET'])
@jwt_required()
def get_user_checkouts():
    user_id = get_jwt_identity()
    checkouts = Checkout.query.filter_by(user_id=user_id).all()
    return jsonify([checkout.to_dict() for checkout in checkouts])