// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const { OpenAI } = require('openai'); 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // 正しい書き方に修正
});

// CORSを有効にしてフロントエンドからのリクエストを許可
app.use(cors());
app.use(express.json());

// OpenAI GPT-4 APIエンドポイント
app.post('/api/predict', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No input text provided' });
  }

  try {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {"role": "system", "content": "Output the rest of the sentence, but NOT more than one sentence out of sequence."},
            {"role": "user", "content": text},
        ],
    });

    const prediction = completion.choices[0].message.content;
    res.json({ prediction });
  } catch (error) {
    console.error('Error with OpenAI API:', error.message);
    res.status(500).json({ error: 'Error generating prediction' });
  }
});

// サーバの起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
