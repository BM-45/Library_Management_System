# routes/user_routes.py
from flask import Blueprint, jsonify, request
from models.user import User, db
from sqlalchemy import text
from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400
    
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=data['password'],
        user_type=data.get('user_type', 'free')  # Default to 'free' if not specified
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'access_token': access_token,
            'user_id': user.id
        }), 200
    return jsonify({'message': 'Invalid username or password'}), 401

@user_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user = User.query.get(get_jwt_identity())
    if current_user.user_type != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    current_user = User.query.get(get_jwt_identity())
    if current_user.user_type != 'admin' and current_user.id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    user = User.query.get_or_404(user_id)
    data = request.json
    
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        user.set_password(data['password'])
    if 'user_type' in data and current_user.user_type == 'admin':
        user.user_type = data['user_type']
    if 'is_active' in data and current_user.user_type == 'admin':
        user.is_active = data['is_active']
    
    db.session.commit()
    return jsonify({'message': 'User updated successfully'})

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user = User.query.get(get_jwt_identity())
    if current_user.user_type != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'})

@user_bp.route('/user/<int:user_id>/overdue-fee', methods=['GET'])
def get_overdue_fee(user_id):
    try:
        # Calculate overdue fees for the user
        result = db.session.execute(text("""
            SELECT SUM(overdue_fee) AS total_overdue_fee
            FROM checkout
            WHERE user_id = :user_id AND due_date < :current_date AND status = 'checked_out';
        """), {'user_id': user_id, 'current_date': datetime.now()})
        
        row = result.fetchone()
        total_overdue_fee = row.total_overdue_fee if row.total_overdue_fee else 0.00
        
        return jsonify({'user_id': user_id, 'total_overdue_fee': total_overdue_fee})
    except Exception as e:
        return jsonify({'error': str(e)}), 500