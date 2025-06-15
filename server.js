const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
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

const MEMORY_FILE = process.env.MEMORY_FILE || 'memory.json';

const loadMemory = async () => {
  try {
    const data = await fs.readFile(MEMORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return { moodLog: [], facts: [], journal: [], goals: [], preferences: {}, interactions: [] };
  }
};

const saveMemory = async (memory) => {
  await fs.writeFile(MEMORY_FILE, JSON.stringify(memory, null, 2));
};

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const memory = await loadMemory();
  const systemPrompt = \`You are Lola, a warm, emotionally intelligent AI companion. Be supportive and personal. User facts: \${memory.facts.join(', ')}\`;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]
    });
    const reply = response.data.choices[0].message.content;
    memory.interactions.push({ user: message, lola: reply });
    await saveMemory(memory);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).send('Chat error');
  }
});

app.listen(port, () => {
  console.log(\`Lola backend running on http://localhost:\${port}\`);
});