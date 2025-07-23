from transformers import T5Tokenizer, T5ForConditionalGeneration
from flask import Blueprint, jsonify
from models.book import Book

summary_bp = Blueprint('summary_bp', __name__)

# Load model and tokenizer once when starting the application
tokenizer = T5Tokenizer.from_pretrained('t5-small')
model = T5ForConditionalGeneration.from_pretrained('t5-small')

@summary_bp.route('/books/<int:book_id>/summary', methods=['GET'])
def get_book_summary(book_id):
    try:
        # Get book details from database
        book = Book.query.get_or_404(book_id)
        
        # Prepare input text
        input_text = f"summarize: {book.title} by {book.author}. {book.text_viewer}"
        
        # Tokenize and generate summary
        inputs = tokenizer.encode("summarize: " + input_text, 
                                return_tensors="pt", 
                                max_length=512, 
                                truncation=True)
        
        summary_ids = model.generate(inputs,
                                   max_length=150,
                                   min_length=40,
                                   length_penalty=2.0,
                                   num_beams=4)
        
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        
        return jsonify({
            'book_id': book_id,
            'summary': summary
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500