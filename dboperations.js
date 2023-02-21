var dbconfig = require('./dbconfig');
const mysql = require('mysql');


async function getUsers(){   //function to get users collection

    const sql = "SELECT * FROM users";

    let result = await executeQuery(sql);

    return result;

}

async function getUsersToAuth(){   //function to get users collection

    const sql = "SELECT email,password,name FROM users";

    let result = await executeQuery(sql);

    return result;

}

async function getUser(id){   //function to get user by id

    const sql = "SELECT * FROM users WHERE id="+id;

    let result = await executeQuery(sql);

    return result;

}

async function getUserBalance(id){   //function to get user by id

    const sql = "SELECT balance FROM users WHERE id="+id;

    let result = await executeQuery(sql);

    return result;

}


async function getOperations(){   //function to get operations collection

    const sql = "SELECT * FROM operations";

    let result = await executeQuery(sql);

    return result;

}

async function getRecords(){   //function to get records collection 

    const sql = "SELECT * FROM records WHERE isDeleted == 0";

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
        //console.log("Database Connected!");
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
    getUser:getUser,
    getUserBalance:getUserBalance,
    getUsersToAuth:getUsersToAuth
};