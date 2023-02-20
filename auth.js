const jwt = require('jsonwebtoken');
const dbOperations = require('./dboperations');

// A sample secret key for JWT
const JWT_SECRET = 'jF3CTBCdAm';

// An array of authorized users
let authorizedUsers = [];


// Middleware function for authentication
async function authenticate(req, res, next) {
  authorizedUsers = await dbOperations.getUsersToAuth();
  authorizedUsers = JSON.parse(JSON.stringify(authorizedUsers));

  // Get the authorization header from the request
  const authHeader = req.headers.authorization;
 console.log(authHeader);
  // Check if the header is present and has the correct format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];
 
  try {
    // Verify the token using the JWT secret key
    const decoded = jwt.verify(token, JWT_SECRET);
    

    // Check if the decoded user is authorized
    const userExist = authorizedUsers.find((u) => u.email === decoded.username);
    if (!userExist) {

      return res.status(401).json({ error: 'Invalid User' });
    }


    // Check if the decoded user is authorized
    const user = authorizedUsers.find((u) => u.email === decoded.username && u.password === decoded.password);
    if (!user) {
      return res.status(401).json({ error: 'Incorrect Password' });
    }

    // Add the user object to the request for use in the controller
    req.user = decoded.username;
    req.token = token;
    // Call the next middleware
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = {
    authenticate:authenticate
};