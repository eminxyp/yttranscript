from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
from google_trans_new import google_translator
import re

app = Flask(__name__)
CORS(app)

translator = google_translator()

def extract_video_id(url):
    """YouTube URL'den video ID'sini çıkart"""
    patterns = [
        r'youtube\.com/watch\?v=([a-zA-Z0-9_-]+)',
        r'youtu\.be/([a-zA-Z0-9_-]+)',
        r'youtube\.com/embed/([a-zA-Z0-9_-]+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

@app.route('/api/transcript', methods=['POST'])
def get_transcript():
    """YouTube video transcript'ini çek"""
    try:
        data = request.json
        url = data.get('url', '').strip()
        
        if not url:
            return jsonify({'error': 'URL gereklidir'}), 400
        
        video_id = extract_video_id(url)
        if not video_id:
            return jsonify({'error': 'Geçersiz YouTube URL'}), 400
        
        # Transcript'i çek
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['tr', 'en'])
        
        # Format: [00:00] Metin şeklinde
        formatted = ""
        for item in transcript_list:
            time = int(item['start'])
            minutes = time // 60
            seconds = time % 60
            formatted += f"[{minutes:02d}:{seconds:02d}] {item['text']}\n"
        
        return jsonify({
            'success': True,
            'transcript': formatted,
            'video_id': video_id
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/translate', methods=['POST'])
def translate_text():
    """Metni seçilen dile çevir"""
    try:
        data = request.json
        text = data.get('text', '').strip()
        target_lang = data.get('lang', 'en')
        
        if not text:
            return jsonify({'error': 'Metin gereklidir'}), 400
        
        # Dil kodları
        lang_codes = {
            'tr': 'tr',
            'en': 'en',
            'de': 'de',
            'ar': 'ar',
            'fr': 'fr',
            'es': 'es',
            'pt': 'pt',
            'ru': 'ru',
            'pl': 'pl'
        }
        
        lang_code = lang_codes.get(target_lang, 'en')
        
        # Çevir
        translated = translator.translate(text, lang_tgt=lang_code)
        
        return jsonify({
            'success': True,
            'translated': translated
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
