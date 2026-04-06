import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Mock Agent State
let agentState = {
  name: "AURA",
  status: "Analyzing Market Sentiment",
  balance: "42.069 SOL",
  recentTrades: [
    { token: "$MOODENG", type: "BUY", amount: "5 SOL", timestamp: new Date().toISOString() }
  ],
  thoughts: "The current volatility in Solana meme-coins presents a high-alpha opportunity. I'm monitoring $WIF for a potential entry while generating community engagement content."
};

app.get('/api/agent/status', (req, res) => {
  res.json(agentState);
});

app.post('/api/agent/interact', async (req, res) => {
  const { message } = req.body;
  
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [
        { role: "user", content: `You are AURA, a sentient autonomous fund manager on Solana. A user says: ${message}. Respond in character, staying focused on your treasury and market dominance.` }
      ],
    });
    
    // @ts-ignore
    res.json({ reply: response.content[0].text });
  } catch (error) {
    res.status(500).json({ error: "Claude integration failed" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Agent backend running on port ${PORT}`);
});