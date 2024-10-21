import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createRule, combineRules, evaluateRule } from './src/utils/ruleEngine.js';

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for the port

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
const uri = process.env.MONGO_URI; // Use environment variable for MongoDB connection string
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB!"))
.catch(err => console.error("MongoDB connection error:", err));

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

app.delete('/api/rules/:id', async (req, res) => {
  const { id } = req.params;
  await Rule.findByIdAndDelete(id);
  res.status(204).send(); // No content
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
