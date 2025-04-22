const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
const fetch = require('node-fetch');
const fs = require('fs-extra');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// In-memory and persistent storage for mood tracking
const MEMORY_FILE = process.env.MEMORY_FILE || 'memory.json';

const loadMemory = async () => {
  try {
    const data = await fs.readFile(MEMORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return { moodLog: [] };
  }
};

const saveMemory = async (memory) => {
  await fs.writeFile(MEMORY_FILE, JSON.stringify(memory, null, 2));
};

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'system', content: 'You are Lola, a supportive AI companion.' },
                 { role: 'user', content: message }]
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).send('Chat error');
  }
});

app.post('/api/mood', async (req, res) => {
  const { mood } = req.body;
  const memory = await loadMemory();
  memory.moodLog.push({ mood, timestamp: new Date().toISOString() });
  await saveMemory(memory);
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Lola backend running at http://localhost:${port}`);
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  const memory = await loadMemory();
  const recentMoods = memory.moodLog?.slice(-3) || [];
  const moodSummary = recentMoods
    .map(entry => `- ${entry.mood} at ${new Date(entry.timestamp).toLocaleString()}`)
    .join('\n');

  const systemPrompt = `You are Lola, a warm and emotionally intelligent AI companion. 
Here is recent mood history of the user:
${moodSummary || "No mood data available yet."}
Use this context to be supportive, reflective, and personal.`;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).send('Chat error');
  }
});
