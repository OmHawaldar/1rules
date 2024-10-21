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

import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://hawaldarom39:<Karbhargalli@39>@cluster0.kf2uz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
