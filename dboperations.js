var dbconfig = require('./dbconfig');
const mysql = require('mysql');


async function getUsers(){   //function to get users collection

    const sql = "SELECT * FROM users";

    let result = await executeQuery(sql);

    return result;

}

async function getUsersToAuth(){   //function to get users collection

    const sql = "SELECT email,password,name,id FROM users";

    let result = await executeQuery(sql);

    return result;

}


async function getUserBalance(userId){   //function to get user by id

    const sql = "SELECT balance FROM users WHERE id="+userId;

    let result = await executeQuery(sql);

    return result;

}

async function chargeOperationToUser(operation,userId){
    const balance = await getUserBalance(userId);
    const operationCost = await getOperationCost(operation);

    if(balance[0].balance >= operationCost[0].cost){
        var balanceUpdated = balance[0].balance - operationCost[0].cost;
        const sql = "UPDATE users SET balance = "+ balanceUpdated +" WHERE id="+userId;
        executeQuery(sql);
     
        return {cost:operationCost[0].cost,balance:balanceUpdated};
    }else{
        return false;
    }

}

async function setRecord(record){
    const sql = "INSERT INTO records (operation_id,user_id,amount,user_balance,operation_response,date,isDeleted)"+
                            " VALUES ("+record.operationId+","+record.userId+","+record.cost+","+record.balance+",'"+record.result+"',NOW(),0)";
   
    try{
        executeQuery(sql);
    }catch(err){
        console.log(err);
    }                         
}

async function deleteRecord(record){
    const sql = "UPDATE records SET isDeleted = 1 WHERE id="+record;
    executeQuery(sql);
}

async function getOperationCost(operationKey){
    var cost;
    var name = "";

    switch(operationKey){
        case "div" :  name = "division";
                    break;
        case "mul" : name = "multiplication";
                    break;
        case 'add' : name = "addition";
                    break;
        case "sub" : name = "subtraction";
                    break;
        case "sqr" : name = "square_root";
                    break;
        case "rnd" : name = "random_string";
                    break;
    }

    const sql = "SELECT cost FROM operations WHERE type LIKE '%"+name+"%'";
 
    cost = await executeQuery(sql);
   
    return cost;
}


async function getOperations(){   //function to get operations collection

    const sql = "SELECT * FROM operations";

    let result = await executeQuery(sql);

    return result;

}

async function getRecords(){   //function to get records collection 

    const sql = "SELECT * FROM records WHERE isDeleted = 0";

    let result = await executeQuery(sql);

    return result;

}

async function getLastRecords(id){   //function to get records collection 

   

    const sql = "SELECT records.id, operations.type,records.amount,records.user_balance,records.operation_response,records.date "+
                "FROM records "+ 
                "INNER JOIN users "+
                "ON `records`.`user_id` = `users`.`id` AND records.user_id ="+id+" AND isDeleted = 0 "+
                "INNER JOIN operations "+
                "ON `records`.`operation_id` = operations.id ORDER BY date DESC";


    let result = await executeQuery(sql);

    return result;

}

async function getAllRecords(){   //function to get records collection showing softdeleted

    const sql = "SELECT * FROM records";

    let result = await executeQuery(sql);

    return result;

}

function executeQuery(query){
    var connection = mysql.createConnection(dbconfig);
    
    connection.connect(function(err){
        if(err) throw err;
        
    });
    return new Promise((resolve, reject) =>{
       
        connection.query(query, function (err,rows,fields){ 
            if(err){
                reject(err);
            }
            else{
                resolve(rows);
            }
            connection.end();
        });
    });
}



module.exports = {
    getUsers:getUsers,
    getOperations:getOperations,
    getRecords:getRecords,
    getAllRecords:getAllRecords,
    getLastRecords:getLastRecords,
    getUserBalance:getUserBalance,
    getUsersToAuth:getUsersToAuth,
    setRecord:setRecord,
    deleteRecord:deleteRecord,
    chargeOperationToUser:chargeOperationToUser
};