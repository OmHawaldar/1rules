import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createRule, combineRules, evaluateRule } from './src/utils/ruleEngine.js';
import ruleEngine from './src/utils/ruleEngine.js';  // adjust the path as necessary


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ruleEngine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Rule Schema
const ruleSchema = new mongoose.Schema({
  ruleString: String,
});

const Rule = mongoose.model('Rule', ruleSchema);

// API Routes
app.post('/api/rules', async (req, res) => {
  const { ruleString } = req.body;
  const rule = new Rule({ ruleString });
  await rule.save();
  res.status(201).json(rule);
});

app.get('/api/rules', async (req, res) => {
  const rules = await Rule.find();
  res.json(rules);
});

app.post('/api/evaluate', async (req, res) => {
  const { userData } = req.body;
  const rules = await Rule.find();
  const ruleStrings = rules.map(rule => rule.ruleString);
  const combinedRule = combineRules(ruleStrings);
  const result = evaluateRule(combinedRule, userData);
  res.json({ result });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.delete('/api/rules/:id', async (req, res) => {
  const { id } = req.params;
  await Rule.findByIdAndDelete(id);
  res.status(204).send(); // No content
});
