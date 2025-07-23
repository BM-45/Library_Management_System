from flask import Blueprint, request, jsonify
from models import db
from models.book import Book
from models.checkout import Checkout
import cv2
import numpy as np
from pyzbar.pyzbar import decode
from datetime import datetime
import os

checkin_bp = Blueprint('checkin_bp', __name__)

@checkin_bp.route('/detect-isbn', methods=['POST'])
def detect_isbn():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        file = request.files['image']
        # Read image using OpenCV
        nparr = np.fromstring(file.read(), np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Detect barcodes using pyzbar
        barcodes = decode(image)
        
        if not barcodes:
            return jsonify({'error': 'No ISBN barcode detected'}), 400

        # Get the first barcode (ISBN)
        isbn = barcodes[0].data.decode('utf-8')
        
        return jsonify({'isbn': isbn})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@checkin_bp.route('/checkin', methods=['POST'])
def checkin_book():
    try:
        data = request.get_json()
        isbn = data.get('isbn')

        if not isbn:
            return jsonify({'error': 'ISBN is required'}), 400

        # Find book by ISBN
        book = Book.query.filter_by(isbn=isbn).first()
        if not book:
            return jsonify({'error': 'Book not found'}), 404

        # Find active checkout for this book
        checkout = Checkout.query.filter_by(
            book_id=book.id,
            status='checked_out'
        ).first()

        if not checkout:
            return jsonify({'error': 'No active checkout found for this book'}), 404

        # Update checkout record
        checkout.status = 'returned'
        checkout.returned_date = datetime.now()
        
        # Update book availability
        book.available_copies += 1

        db.session.commit()

        return jsonify({
            'message': 'Book checked in successfully',
            'book_title': book.title,
            'return_date': checkout.returned_date.isoformat()
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500