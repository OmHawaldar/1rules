# Rule Engine Application

This project implements a simple 3-tier rule engine application designed to dynamically create, combine, and evaluate user eligibility rules based on attributes such as age, department, salary, and experience. The system utilizes an Abstract Syntax Tree (AST) to represent conditional rules, allowing flexible management of these rules through a structured data model.


Take a look at play with the live running application deployed using Netlify https://om-rule-engine.netlify.app/ use password as "adminPassword", refresh and try again if the "backend not connected" error occurs

## Data Structure for Rule Representation

The rules are represented using an Abstract Syntax Tree (AST). The AST is defined with the following structure:

- **Node**:
  - `type`: A string indicating the node type. Can be either `"operator"` for logical AND/OR operations or `"operand"` for conditions.
  - `left`: Reference to another node, representing the left child in the AST (for operators).
  - `right`: Reference to another node, representing the right child in the AST (for operators).
  - `value`: Holds the value for operand nodes, such as numbers for comparison (e.g., age, salary).

This data structure allows for easy dynamic creation, modification, and combination of rules.

### Sample Rule AST Representation

Consider the following rule example:

```text
((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)
```
This rule would be translated into an AST with the following structure:

- **Root Node**: Operator `AND`
  - **Left Child**: Operator `OR`
    - **Left Child**: Operator `AND`
      - **Left Child**: Operand `age > 30`
      - **Right Child**: Operand `department = 'Sales'`
    - **Right Child**: Operator `AND`
      - **Left Child**: Operand `age < 25`
      - **Right Child**: Operand `department = 'Marketing'`
  - **Right Child**: Operator `OR`
    - **Left Child**: Operand `salary > 50000`
    - **Right Child**: Operand `experience > 5`

This data structure makes it easy to modify or combine rules.





## Features

- Add, delete, and fetch rules.
- Evaluate user data against defined rules.
- Admin password protection for adding and deleting rules.

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB Atlas account (for database)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd path/to/your/backend
   
2. Install the backend dependencies:
   ```bash
   npm install express mongoose

3. Get your MongoDB connection string and add:
   ```bash
   MONGO_URI=your_mongodb_connection_string
   
4. Start the backend server:
   ```bash
   node server.js
### Feature Setup

1. Navigate to the frontend directory:
    ```bash
   cd path/to/your/frontend
    
2. Initialize the frontend project (if not already done):
   ```bash
   npm init -y
   
3. Install the frontend dependencies:
   ```bash
   npm install react react-dom react-scripts

4. Start the frontend application:
   ```bash
   npm start



## Requirements

### Backend Dependencies
- **express**: Web framework for Node.js
- **mongoose**: MongoDB object modeling for Node.js
- **cors**: Middleware to enable CORS
- **dotenv**: Module to load environment variables from a .env file

### Frontend Dependencies
- **react**: JavaScript library for building user interfaces
- **react-dom**: React package for working with the DOM
- **react-scripts**: Scripts and configuration used by Create React App

## Installation Commands
### Backend

  To install all backend dependencies, run:
```bash
npm install express mongoose cors 
```
### Frontend

   To install all frontend dependencies, run:
   ```bash
npm install react react-dom react-scripts
```

## Usage

Open your browser and navigate to `http://localhost:3000` or press ctrl and click on the link in the IDE terminal to access the frontend.
Use the admin password to log in and manage rules.

## API Endpoints
- **GET /api/rules**: Fetch all rules.
- **POST /api/rules**: Add a new rule.
- **DELETE /api/rules/:id**: Delete a rule by ID.
- **POST /api/evaluate**: Evaluate user data against the rules.


## Contributing
Contributions are welcome! Please feel free to submit a pull request.
Free fell to contact for any suggestions, queries [hawaldarom39@gmail.com].


  




