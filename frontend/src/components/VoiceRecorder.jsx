import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import Button from './ui/Button';

const VoiceRecorder = ({ onTranscriptChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + ' ';
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      const fullTranscript = transcript + finalTranscript + interimTranscript;
      setTranscript(fullTranscript);
      onTranscriptChange(fullTranscript);
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognitionInstance.onend = () => {
      setIsRecording(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      recognition.start();
      setIsRecording(true);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-800">Voice input not supported</p>
          <p className="text-sm text-yellow-700 mt-1">
            Please use Chrome or Edge browser for voice input functionality.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        onClick={toggleRecording}
        variant={isRecording ? 'secondary' : 'primary'}
        className="flex items-center gap-2"
      >
        {isRecording ? (
          <>
            <MicOff className="h-4 w-4" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            Start Voice Input
          </>
        )}
      </Button>

      {isRecording && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
          <p className="text-sm text-red-700 font-medium">Recording... Speak now</p>
        </div>
      )}

      {transcript && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Live Transcription:</p>
          <p className="text-sm text-gray-900">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
