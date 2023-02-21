const jwt = require('jsonwebtoken');
const dbOperations = require('./dboperations');

// A sample secret key for JWT
const JWT_SECRET = "jF3CTBCdAm";

// An array of authorized users
let authorizedUsers = [];

async function login(req, res, next){

    token = jwt.sign({
        username: req.body.username,
        password: req.body.password
    },JWT_SECRET)
    req.token = token;
     next();

}


// Middleware function for authentication
async function authenticate(req, res, next) {
  authorizedUsers = await dbOperations.getUsersToAuth();
  authorizedUsers = JSON.parse(JSON.stringify(authorizedUsers));
  const token = req.token;
 
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
    req.user = user.email;
    req.name = user.name;
    req.status = "ok";
    // Call the next middleware
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = {
    authenticate:authenticate,
    login:login
};