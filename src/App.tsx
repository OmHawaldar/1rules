import React, { useState, useEffect } from 'react';
import { UserData } from './types/ruleEngine';
import './App.css';

function App() {
  const [rules, setRules] = useState<{ _id: string; ruleString: string }[]>([]);
  const [newRule, setNewRule] = useState('');
  const [userData, setUserData] = useState<UserData>({
    age: 0,
    department: '',
    salary: 0,
    experience: 0,
  });
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch('https://rule-engine-o3rl.onrender.com/api/rules'); // Correct URL
      if (!response.ok) {
        throw new Error('Failed to fetch rules');
      }
      const data = await response.json();
      setRules(data);
    } catch (err) {
      setError('Failed to fetch rules. Make sure the backend server is running.');
    }
  };

  const handleAddRule = async () => {
    if (!isAdmin || !newRule) return;
  
    try {
      const response = await fetch('https://rule-engine-o3rl.onrender.com/api/rules', { // Correct URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleString: newRule }),
      });
      if (!response.ok) {
        throw new Error('Failed to add rule');
      }
      setNewRule('');
      fetchRules();
    } catch (err) {
      setError('Failed to add rule. Make sure the backend server is running.');
    }
  };

  
const handleDeleteRule = async (id: string) => {
  if (!isAdmin) return;

  try {
    const response = await fetch(`https://rule-engine-o3rl.onrender.com/api/rules/${id}`, { // Correct URL
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete rule');
    }
    fetchRules(); // Refresh the rules list
  } catch (err) {
    setError('Failed to delete rule. Make sure the backend server is running.');
  }
};

const handleEvaluate = async () => {
  if (rules.length > 0) {
    try {
      const response = await fetch('https://rule-engine-o3rl.onrender.com/api/evaluate', { // Correct URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData }),
      });
      if (!response.ok) {
        throw new Error('Failed to evaluate rules');
      }
      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      setError('Failed to evaluate rules. Make sure the backend server is running.');
    }
  }
};

  const handleLogin = () => {
    // Replace 'adminPassword' with your secure password
    if (password === 'adminPassword') {
      setIsAdmin(true);
      setPassword(''); // Clear the password field
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Rule Engine</h1>
        
        {error && (
          <div className="bg-red-700 border border-red-500 text-white px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {!isAdmin ? (
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full p-2 border rounded bg-gray-700 text-white"
            />
            <button onClick={handleLogin} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Login
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Add Rule</h2>
              <input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white"
                placeholder="Enter rule (e.g., age > 30 AND department = 'Sales')"
              />
              <button
                onClick={handleAddRule}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Rule
              </button>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Current Rules</h2>
              {rules.length > 0 ? (
                <ul className="list-disc pl-5">
                  {rules.map((rule) => (
                    <li key={rule._id} className="flex justify-between items-center">
                      {rule.ruleString}
                      <button onClick={() => handleDeleteRule(rule._id)} className="text-red-500 ml-2">
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No rules added yet.</p>
              )}
            </div>
          </div>
        )}

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">User Data</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(userData).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-300">{key}</label>
                <input
                  type={typeof value === 'number' ? 'number' : 'text'}
                  value={value}
                  onChange={(e) => setUserData({ ...userData, [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value })}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2 bg-gray-700 text-white"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleEvaluate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={rules.length === 0}
        >
          Evaluate Rules
        </button>

        {result !== null && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Result</h2>
            <p className={`text-lg ${result ? 'text-green-400' : 'text-red-400'}`}>
              {result ? 'User is eligible' : 'User is not eligible'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
