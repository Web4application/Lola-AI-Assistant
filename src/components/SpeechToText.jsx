import React, { useState, useEffect } from 'react';

const SpeechToText = ({ onTranscribe }) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = React.useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscribe(transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, [onTranscribe]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <button onClick={toggleRecording}>
      {isRecording ? 'Listening… Click to stop' : 'Speak to Lola'}
    </button>
  );
};

export default SpeechToText;