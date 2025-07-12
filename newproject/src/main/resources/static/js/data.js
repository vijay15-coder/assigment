let mockEmployees = [
  { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', department: 'HR', role: 'Manager' },
  { id: 2, firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', department: 'IT', role: 'Developer' },
  { id: 3, firstName: 'Charlie', lastName: 'Lee', email: 'charlie@example.com', department: 'Finance', role: 'Analyst' },
  { id: 4, firstName: 'Diana', lastName: 'White', email: 'diana@example.com', department: 'Marketing', role: 'Designer' }
];

let currentPage = 1;
let itemsPerPage = 5;
let filteredEmployees = [...mockEmployees];
let editId = null;