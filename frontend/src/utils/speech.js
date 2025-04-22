export const speakText = (text) => {
  const synth = window.speechSynthesis;
  if (!synth) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.pitch = 1;
  utterance.rate = 1;
  utterance.volume = 1;
  synth.cancel(); // clear previous queue
  synth.speak(utterance);
};