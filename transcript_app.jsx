import React, { useState } from 'react';
import { Copy, Download, Search, Loader, Volume2 } from 'lucide-react';

export default function TranscriptApp() {
  const [videoUrl, setVideoUrl] = useState('');
  const [transcript, setTranscript] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('tr');
  const [translatedText, setTranslatedText] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Örnek transcript verisi (backend'den gelecek)
  const mockTranscript = `[00:00] Merhaba, YouTube'a hoş geldiniz!
[00:05] Bugün size harika bir proje hakkında bahsedeceğim.
[00:15] Bu video tamamen Türkçe'dir.
[00:20] Transcript özelliği sayesinde yazılı olarak da takip edebilirsiniz.
[00:30] Birden fazla dile çevirme imkanı sunuyoruz.
[00:40] İndir, kopyala ve çevirme özelliğini kullanabilirsiniz.
[00:50] Bu proje sade ama profesyonel tasarımla yapılmıştır.`;

  const languages = {
    tr: '🇹🇷 Türkçe',
    en: '🇬🇧 İngilizce',
    de: '🇩🇪 Almanca',
    ar: '🇸🇦 Arapça',
    fr: '🇫🇷 Fransızca',
    es: '🇪🇸 İspanyolca',
    pt: '🇵🇹 Portekizce',
    ru: '🇷🇺 Rusça',
    pl: '🇵🇱 Lehçe'
  };

  const handleFetchTranscript = async () => {
    if (!videoUrl.trim()) {
      alert('Lütfen geçerli bir YouTube URL girin');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: videoUrl })
      });
      
      const data = await response.json();
      if (data.success) {
        setTranscript(data.transcript);
        setTranslatedText(null);
        setSearchQuery('');
      } else {
        alert('Hata: ' + data.error);
      }
    } catch (error) {
      alert('Bağlantı hatası: Backend çalışıyor mu? (localhost:5000)');
    }
    setIsLoading(false);
  };

  const handleTranslate = async () => {
    if (!transcript) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: transcript,
          lang: selectedLanguage
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setTranslatedText(data.translated);
      } else {
        alert('Çeviri hatası: ' + data.error);
      }
    } catch (error) {
      alert('Bağlantı hatası');
    }
    setIsLoading(false);
  };

  const handleCopy = () => {
    const textToCopy = translatedText || transcript;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = translatedText || transcript;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textToDownload));
    element.setAttribute('download', 'transcript.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const displayText = translatedText || transcript;
  const filteredText = displayText ? displayText
    .split('\n')
    .filter(line => line.toLowerCase().includes(searchQuery.toLowerCase()))
    .join('\n') : '';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F0F7FF 0%, #E0F2FF 100%)',
      padding: '2rem 1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0, 172, 193, 0.08)',
          border: '1px solid #B3E5FC'
        }}>
          <h1 style={{
            margin: '0 0 0.5rem 0',
            color: '#004D73',
            fontSize: '28px',
            fontWeight: '600'
          }}>📹 Transcript Çevirici</h1>
          <p style={{
            margin: 0,
            color: '#666',
            fontSize: '14px'
          }}>YouTube videolarını transkript edin, 9 dile çevirin ve indirin</p>
        </div>

        {/* Input Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid #B3E5FC'
        }}>
          <label style={{
            display: 'block',
            marginBottom: '0.75rem',
            color: '#004D73',
            fontWeight: '500',
            fontSize: '14px'
          }}>YouTube Video URL'i</label>
          
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              style={{
                flex: 1,
                minWidth: '250px',
                padding: '12px 14px',
                border: '1px solid #B3E5FC',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'monospace'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleFetchTranscript()}
            />
            
            <button
              onClick={handleFetchTranscript}
              disabled={isLoading}
              style={{
                padding: '12px 20px',
                background: isLoading ? '#E0E0E0' : '#00ACC1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => !isLoading && (e.target.style.background = '#008BA3')}
              onMouseOut={(e) => !isLoading && (e.target.style.background = '#00ACC1')}
            >
              {isLoading ? <Loader size={16} style={{animation: 'spin 1s linear infinite'}} /> : '✓'}
              {isLoading ? 'Yükleniyor...' : 'Transcript Çek'}
            </button>
          </div>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid #B3E5FC',
            marginBottom: '2rem'
          }}>
            {/* Language & Controls */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #B3E5FC',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>

              <button
                onClick={handleTranslate}
                disabled={isLoading}
                style={{
                  padding: '8px 16px',
                  background: '#E3F2FD',
                  color: '#004D73',
                  border: '1px solid #00ACC1',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => (e.target.style.background = '#B3E5FC')}
                onMouseOut={(e) => (e.target.style.background = '#E3F2FD')}
              >
                {isLoading ? 'Çevriliyor...' : '🌐 Çevir'}
              </button>

              <button
                onClick={handleCopy}
                style={{
                  padding: '8px 16px',
                  background: copied ? '#4CAF50' : '#E3F2FD',
                  color: copied ? 'white' : '#004D73',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Copy size={16} style={{display: 'inline', marginRight: '4px'}} />
                {copied ? 'Kopyalandı!' : 'Kopyala'}
              </button>

              <button
                onClick={handleDownload}
                style={{
                  padding: '8px 16px',
                  background: '#E3F2FD',
                  color: '#004D73',
                  border: '1px solid #00ACC1',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => (e.target.style.background = '#B3E5FC')}
                onMouseOut={(e) => (e.target.style.background = '#E3F2FD')}
              >
                <Download size={16} style={{display: 'inline', marginRight: '4px'}} />
                İndir (TXT)
              </button>
            </div>

            {/* Search */}
            <div style={{
              marginBottom: '1.5rem',
              position: 'relative'
            }}>
              <Search size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#999'
              }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Transcript'te ara..."
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  border: '1px solid #B3E5FC',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Transcript Text */}
            <div style={{
              background: '#F8FBFC',
              border: '1px solid #B3E5FC',
              borderRadius: '8px',
              padding: '1.5rem',
              fontFamily: 'monospace',
              fontSize: '13px',
              lineHeight: '1.8',
              color: '#333',
              maxHeight: '500px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}>
              {searchQuery && filteredText.length === 0 ? (
                <span style={{color: '#999'}}>Arama sonucu bulunamadı</span>
              ) : filteredText || displayText}
            </div>

            {translatedText && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                background: '#E8F5E9',
                border: '1px solid #81C784',
                borderRadius: '8px',
                color: '#2E7D32',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                ✓ {languages[selectedLanguage]}'ye çevrildi
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {!transcript && !isLoading && (
          <div style={{
            textAlign: 'center',
            color: '#666',
            fontSize: '14px',
            padding: '2rem'
          }}>
            <div style={{fontSize: '48px', marginBottom: '1rem'}}>🎬</div>
            <p style={{margin: '0.5rem 0'}}>YouTube videosu linkini yapıştırarak başlayın</p>
            <p style={{margin: '0.5rem 0', color: '#999', fontSize: '13px'}}>
              Transcript'i 9 dile çevirip indir veya kopyala
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        input:focus, select:focus {
          outline: none;
          border-color: #00ACC1 !important;
          box-shadow: 0 0 0 3px rgba(0, 172, 193, 0.1);
        }
      `}</style>
    </div>
  );
}
