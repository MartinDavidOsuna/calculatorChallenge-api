const dbOperations = require('./dboperations');
const calcOperations = require('./calcoperations');
const secureAuth = require('./auth');
const config = require('./config');
const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');


const app = express();
var router = express.Router();


app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cors(config.application));
app.use('/api',router);

router.use((request,response,next)=>{
    //console.log('Operation successful');
    next();
})

router.route('/users').get((request,response)=>{
    dbOperations.getUsers().then(result => {
       response.json(result);
    })
})

router.route('/operations').get((request,response)=>{
    dbOperations.getOperations().then(result => {
       response.json(result);
    })
})

router.route('/records').get((request,response)=>{
    dbOperations.getRecords().then(result => {
       response.json(result);
    })
})

router.route('/operations/:function&:value1&:value2').post((request,response)=>{
    calcOperations.operation(request.params.function,request.params.value1,request.params.value2).then(result => {
        response.status(201).json(result);
     })
})

router.route('/operations/:function&:value1').post((request,response)=>{
    calcOperations.sqr(request.params.function,request.params.value1).then(result => {
        response.status(201).json(result);
    })
})





// Protected route that requires authentication
router.route('/login').get(secureAuth.authenticate, (req, res) => {
    // The user object is available in the req object due to the authenticate middleware
    const user = req.user;
    const token = req.token;
   
    res.json({ user, token });
  });


router.route('/operations/:function').post((request,response)=>{
    calcOperations.random(request.params.function).then(result => {
        response.status(201).json(result);
    })
})


var port = process.env.PORT || 8090
app.listen(port);
console.debug('Server listening on port ' + port);