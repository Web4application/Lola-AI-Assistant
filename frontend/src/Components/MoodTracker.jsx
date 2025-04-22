
import React, { useState } from 'react';

export default function MoodTracker() {
  const [mood, setMood] = useState('');

  const submitMood = async () => {
    await fetch('/api/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood })
    });
    setMood('');
  };

  return (
    <div className="mood-tracker">
      <h3>How are you feeling?</h3>
      <input
        value={mood}
        onChange={e => setMood(e.target.value)}
        placeholder="Enter your mood"
      />
      <button onClick={submitMood}>Submit</button>
    </div>
  );
}
