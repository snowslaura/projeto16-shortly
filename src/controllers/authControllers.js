import db from "./../app/db.js"
import {v4 as uuid} from "uuid"
import bcrypt from "bcrypt"


export async function signUp(req,res){
    const {name,email,password} = req.body    
    try{
        const {rows: result} = await db.query('SELECT * FROM users WHERE email=$1', [email]);
        if(result.rowsCount>0){
            return res.sendStatus(409);
        }
        const passwordHash = bcrypt.hashSync(password,parseInt(process.env.HASH));
        await db.query('INSERT INTO users (name,email,password) VALUES ($1,$2,$3)',[name,email,passwordHash]);
        res.sendStatus(201);
    }catch(e){
        console.error(e);
        res.sendStatus(500);
    }    
}

export async function signIn(req,res){
 const {email, password} = req.body
    try{       
        const {rows:userDataResult} = await db.query(`SELECT * FROM users WHERE email=$1`,[email])
        if(userDataResult.length === 0 || !bcrypt.compareSync(password, userDataResult[0].password)){  
            return res.status(401).send("Dados inválidos")
        }
        const token = uuid();
        await db.query(`INSERT INTO sessions ("userId", token) VALUES ($1,$2)`,[userDataResult[0].id, token])
        res.status(200).send(token)

    }catch(e){
        console.error(e)
        res.sendStatus(500)     
    }
}

