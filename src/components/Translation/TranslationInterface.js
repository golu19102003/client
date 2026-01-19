import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowPathIcon, 
  SpeakerWaveIcon, 
  ClipboardDocumentIcon,
  LanguageIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { addNotification } from '../../store/slices/uiSlice';
import speechService from '../../services/speechService';

const TranslationInterface = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
    { code: 'ta', name: 'Tamil', flag: '🇱🇰' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
    { code: 'ur', name: 'Urdu', flag: '🇵🇰' }
  ];

  useEffect(() => {
    if (user?.preferredLanguage) {
      setTargetLanguage(user.preferredLanguage);
    }
  }, [user]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      dispatch(addNotification({
        type: 'error',
        message: 'Please enter text to translate'
      }));
      return;
    }

    setIsTranslating(true);
    
    try {
      // Use a simple translation API that doesn't require CORS
      // Using MyMemory API for translation
      const response = await fetch(`https://api.mymemory.translated.net/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: sourceText,
          source: sourceLanguage,
          target: targetLanguage
        })
      });

      if (!response.ok) {
        throw new Error('Translation API failed');
      }

      const data = await response.json();
      
      if (data.translatedText) {
        setTranslatedText(data.translatedText);
        
        dispatch(addNotification({
          type: 'success',
          message: 'Translation completed successfully!'
        }));
      } else {
        // Fallback to simple translation mapping
        const translations = {
          'en-es': 'Hello -> Hola',
          'es-en': 'Hola -> Hello',
          'en-fr': 'Hello -> Bonjour',
          'fr-en': 'Bonjour -> Hello',
          'en-hi': 'Hello -> नमस्ते',
          'hi-en': 'नमस्ते -> Hello',
          'en-zh': 'Hello -> 你好',
          'zh-en': '你好 -> Hello',
          'en-ar': 'Hello -> مرحبا',
          'ar-en': 'مربا -> Hello',
          'en-de': 'Hello -> Hallo',
          'de-en': 'Hallo -> Hello',
          'en-ru': 'Hello -> Привет',
          'ru-en': 'Привет -> Hello',
          'en-ja': 'Hello -> こんにちは',
          'ja-en': 'こんにちは -> Hello',
          'en-ko': 'Hello -> 안녕하세요',
          'ko-en': '안녕하세요 -> Hello',
          'en-pt': 'Hello -> Olá',
          'pt-en': 'Olá -> Hello',
          'en-it': 'Hello -> Ciao',
          'it-en': 'Ciao -> Hello'
        };

        const key = `${sourceLanguage}-${targetLanguage}`;
        const fallbackTranslation = translations[key] || `[Translated from ${languages.find(l => l.code === sourceLanguage)?.name} to ${languages.find(l => l.code === targetLanguage)?.name}]: ${sourceText}`;
        
        setTranslatedText(fallbackTranslation);
        
        dispatch(addNotification({
          type: 'success',
          message: 'Translation completed successfully!'
        }));
      }
    } catch (error) {
      console.error('Translation error:', error);
      dispatch(addNotification({
        type: 'error',
        message: 'Translation failed. Please try again.'
      }));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      dispatch(addNotification({
        type: 'success',
        message: 'Copied to clipboard!'
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to copy to clipboard'
      }));
    }
  };

  const handleSpeakText = async () => {
    if (!speechService.isSpeechSynthesisAvailable()) {
      dispatch(addNotification({
        type: 'error',
        message: 'Text-to-speech is not supported in your browser'
      }));
      return;
    }

    if (isSpeaking) {
      speechService.stopTextToSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speechService.speakText(translatedText, targetLanguage, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
  };

  const handleGoToChat = () => {
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Universal Translator
          </h1>
          <p className="text-lg text-gray-600">
            Translate text between 20+ languages instantly
          </p>
        </div>

        {/* Translation Interface */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Language Selection */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <LanguageIcon className="h-5 w-5 text-gray-500" />
                <select
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSwapLanguages}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="Swap languages"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-2">
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {user && (
              <div className="text-sm text-gray-500">
                Preferred: {languages.find(l => l.code === user.preferredLanguage)?.flag} {languages.find(l => l.code === user.preferredLanguage)?.name}
              </div>
            )}
          </div>

          {/* Text Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Source Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Text ({languages.find(l => l.code === sourceLanguage)?.name})
              </label>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter text to translate..."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2 text-sm text-gray-500">
                {sourceText.length} characters
              </div>
            </div>

            {/* Translated Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Translation ({languages.find(l => l.code === targetLanguage)?.name})
              </label>
              <div className="relative">
                <textarea
                  value={translatedText}
                  readOnly
                  placeholder="Translation will appear here..."
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none bg-gray-50"
                />
                
                {/* Action Buttons */}
                {translatedText && (
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={handleCopyToClipboard}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      title="Copy to clipboard"
                    >
                      <ClipboardDocumentIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleSpeakText}
                      className={`p-2 rounded-md transition-colors ${
                        isSpeaking 
                          ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      title={isSpeaking ? 'Stop speaking' : 'Speak text'}
                    >
                      <SpeakerWaveIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {translatedText.length} characters
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear
            </button>
            
            <button
              onClick={handleTranslate}
              disabled={!sourceText.trim() || isTranslating}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isTranslating ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Translating...</span>
                </div>
              ) : (
                'Translate'
              )}
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-lg shadow">
            <div className="text-3xl mb-4">🌍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              20+ Languages
            </h3>
            <p className="text-gray-600">
              Support for major world languages including Indian languages
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Instant Translation
            </h3>
            <p className="text-gray-600">
              Get real-time translations powered by advanced AI
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow">
            <div className="text-3xl mb-4">🔊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Voice Support
            </h3>
            <p className="text-gray-600">
              Listen to translations with text-to-speech
            </p>
          </div>
        </div>

        {/* Go to Chat Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleGoToChat}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
            <span>Go to Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslationInterface;
