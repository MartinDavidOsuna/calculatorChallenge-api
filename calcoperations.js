var dbOperations = require('./dboperations');
const mysql = require('mysql');
const request = require('request'); 

async function operation(operation,val1,val2,userId){
    var result;
    var operationId;
    var operationCost;
    var record = {};
    if(operation != "rnd"){
        if(val1!="" && val2!="" ){
            switch (operation){
                case 'add' : result = Number(val1)+Number(val2);
                            operationId=1;
                            break;
                case 'sub' : result = val1-val2;
                            operationId=2;
                            break;
                case 'mul' : result = val1*val2;
                            operationId=3;
                            break;
                case 'div' : result = val1/val2;
                            operationId=4;
                            break;
                default: 
                        if(operation =="sqr"){
                            return "error calling function "+operation+",too much parameters";
                        }else{
                            return "invalid operation";
                        }
            }
        }else{
            if(val1!="" && operation=="sqr"){
                result= Math.sqrt(val1);
                operationId=5;
            }else{
                return "error calling function "+operation;
            }
        }
    }else{
        result = await getRandomString();
        operationId=6;
    }
    operationCost = await dbOperations.chargeOperationToUser(operation,userId);
    record = {
        operationId:operationId,
        userId:userId,
        cost:operationCost.cost,
        balance:operationCost.balance,
        result:result
    }


    if(operationCost && result!=null){
        try{
            dbOperations.setRecord(record);
        }catch (err){
            return "Error: impossible to set record on Database"
        }
        
        return result;
    }else{
        return "Declined: Not enough available credit";
    }
}



//DEPRECIATED
async function sqr(operation,val1){
    var result;
    if(operation="sqr"){
        result= Math.sqrt(val1);
    }else{
        if(operation=="add" || operation=="sub" || operation=="mul" || operation=="div"){
            console.log("error calling function "+operation+",expecting two parameters");
        }else{
            if(operation=="rnd"){
                console.log("error calling function "+operation+",expecting no parameters");
            }else{
                console.log("invalid operation");
            }
        }
    }
    return result;
    

}

//DEPRECIATED
async function random(operation){

    var result;
    if(operation=="rnd"){
        result = await getRandomString();
        return result;
          
    }else{
        if(operation=="add" || operation=="sub" || operation=="mul" || operation=="div"){
            console.log("error calling function "+operation+",expecting two parameters");
        }else{
            if(operation=="sqr"){
                console.log("error calling function "+operation+",expecting one parameter");
            }else{
                return "error: invalid operation";
            }
        } 
    }
    
}

async function getRandomString(){

    const url = 'https://api.random.org/json-rpc/4/invoke';

    const params = {
        apiKey:'9b159c40-7898-4cb3-8aef-6e7b1a700109',
        n:1,
        length:10,
        characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
        replacement: true
    };

    const options = {
        method: 'POST',
        uri: url,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          jsonrpc: '2.0',
          method: 'generateStrings',
          params: params,
          id: 1
        },
        json: true
      };

      return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body.result.random.data);
            }
        });
      });
}

module.exports = {
    operation:operation,
    random:random,
    sqr:sqr
};