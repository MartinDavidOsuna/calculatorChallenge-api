const dbOperations = require('./dboperations');
const calcOperations = require('./calcoperations');
const secureAuth = require('./auth');
const config = require('./config');
const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const https = require("https");
const fs = require("fs");
const app = express();
var router = express.Router();

const options = {
    key: fs.readFileSync("./config/cert.key"),
    cert: fs.readFileSync("./config/cert.crt"),
}

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cors(config.application));
app.use('/api/V1',router);

router.use((request,response,next)=>{
    next();
})

router.route('/users').post(secureAuth.authenticate,(request,response)=>{
    const status = request.status;
    const error_msg = request.error_msg;
    if(status == "ok"){
        dbOperations.getUsers().then(result => {
            response.json(result);
        })
    }else{
        response.status(201).json({ status, error_msg}); 
    }
})

router.route('/users/balance').post(secureAuth.authenticate,(request,response)=>{
    const user_id = request.body.id;
    const status = request.status;
    const error_msg = request.error_msg;
    if(status == "ok"){
        dbOperations.getUserBalance(user_id).then(result => {
            response.json(result);
        })
    }else{
        response.status(201).json({ status, error_msg}); 
    }
})

router.route('/operations').post(secureAuth.authenticate,(request,response)=>{
    const status = request.status;
    const error_msg = request.error_msg;
    if(status == "ok"){
        dbOperations.getOperations().then(result => {
            response.json(result);
        })
    }else{
        response.status(201).json({ status, error_msg}); 
    }
})

router.route('/lastRecords').post(secureAuth.authenticate,(request,response)=>{
    const user_id = request.body.id;
    const status = request.status;
    const error_msg = request.error_msg;
    if(status == "ok"){
        dbOperations.getLastRecords(user_id).then(result => {
            response.json(result);
        })
    }else{
        response.status(201).json({ status, error_msg}); 
    }
})

router.route('/deleteRecord').post(secureAuth.authenticate,(request,response)=>{
    const record_id = request.body.id;
    const status = request.status;
    const error_msg = request.error_msg;
    if(status == "ok"){
        dbOperations.deleteRecord(record_id).then(result => {
            response.json(result);
         })
    }else{
        response.status(201).json({ status, error_msg}); 
    }
})

router.route('/operation').post(secureAuth.authenticate,(request,response)=>{
    const operation = request.body.operation;
    const value1 = request.body.value1;
    const value2 = request.body.value2;
    const userId = request.userid;
    const status = request.status;
    const error_msg = request.error_msg;
    if(status == "ok"){
        calcOperations.operation(operation,value1,value2,userId).then(result => {
            if(status == "ok"){
                response.status(201).json(result);
            }else{
                response.status(201).json({ status:"error", error_msg:result});
            }
        })
    }else{
        response.status(201).json({ status, error_msg}); 
    }
})

router.route('/auth').post(secureAuth.login,secureAuth.authenticate,(request,response) =>{
    const name = request.name;
    const user = request.user;
    const userId = request.userid;
    const token = request.body.token;
    const status = request.status;
    const error_msg = request.error_msg;
    if(status == "ok"){
        response.status(201).json({ status, userId, name, user, token });
    }else{
        response.status(201).json({ status, error_msg});
    }
});

router.route('/login').get(secureAuth.authenticate, (req, res) => {
    const user = req.user;
    const token = req.token;
    res.json({ user, token });
});

var port = process.env.PORT || 9090
app.listen(port);

https.createServer(options, app).listen(8090, () =>{
    console.log('Server https listening on port 9090');
});
