var dbconfig = require('./dbconfig');
const mysql = require('mysql');
const request = require('request'); 

async function operation(operation,val1,val2){
    var result;
    if(val1!="" && val2!=""){
        switch (operation){
            case 'add' : result = Number(val1)+Number(val2);
                        break;
            case 'sub' : result = val1-val2;
                        break;
            case 'mul' : result = val1*val2;
                        break;
            case 'div' : result = val1/val2;
                        break;
            default: 
                    if(operation =="sqr" && operation=="rnd"){
                        console.log("error calling function "+operation+",too much parameters");
                    }else{
                        console.log("invalid operation");
                    }
                    break;
        }
        return result;
    }else{
        console.log("error calling function "+operation+",empty parameter");
    }
    

}

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

    let word;

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