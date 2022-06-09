import db from "../app/db.js";
import {customAlphabet} from "nanoid"

export async function postUrl(req,res){
    const url = res.locals.url   
    
    try{
        const {rows: result} = await db.query(`SELECT * FROM sessions WHERE token=$1`,[res.locals.token])
        if(result.length===0){
            return res.sendStatus(401);
        }
        const nanoid = customAlphabet('1234567890abcdef', 6)
        let shortUrl = nanoid() 
        const response = {
            "shortUrl": shortUrl
        } 
        const {rows:urlResult} = await db.query(`SELECT "shortUrl" from "shortlyUrls" WHERE "shortUrl"=$1`,[shortUrl])
        if(urlResult.length>0){
            shortUrl = nanoid()
        }
        await db.query(`INSERT INTO "shortlyUrls" ("userId", url, "shortUrl", "visitCount") VALUES ($1,$2,$3,$4)`,[result[0].userId, url, shortUrl, 0 ])
        res.status(201).send(response)
    }catch(e){
        console.error(e)
        res.sendStatus(500)
    }
}

export async function getUrl(req,res){
    const {id} = req.params
    
    try{
        const {rows:result} = await db.query(`SELECT * FROM "shortlyUrls" where id=$1`,[id])
        if(result.length<1 || result.deleteAt){
            return res.sendStatus(404)
        }

        const response = {
            "id": result[0].id,
            "shortUrl": result[0].shortUrl,
            "url": result[0].url
        }

        res.status(200).send(response)
       
    }catch(e){
        console.error(e)
        res.sendStatus(500)
    }
}

export async function getShortUrl(req,res){
   const {shortUrl} = req.params
    try{
        const {rows:result} = await db.query(`SELECT * FROM "shortlyUrls" WHERE "shortUrl"=$1`,[shortUrl])
        if(result.length<1 || result.deleteAt){
            return res.sendStatus(404)
        }
        let views = result[0].visitCount
        views++
        await db.query(`UPDATE "shortlyUrls" SET "visitCount"=$1 WHERE "shortUrl"=$2`,[views,shortUrl])
        res.redirect(result[0].url);
    }catch(e){
        console.error(e);
        res.sendStatus(500);
    }
}

export async function deleteShortUrl(req,res){
    const {id} = req.params
    const token = res.locals.token

    try{
        const{rows:urlResult} = await db.query(`SELECT * FROM "shortlyUrls" WHERE id=$1`,[id])
        if(urlResult.length===0){
            return res.sendStatus(404)
        }

        const{rows:result} = await db.query(`
            SELECT sessions.id as "idUrl", sessions.token, "shortlyUrls"."deletedAt" 
            FROM "sessions" 
            JOIN "shortlyUrls" 
            ON sessions."userId" = "shortlyUrls"."userId"
            WHERE "shortlyUrls".id = $1 AND sessions.token=$2  `,[id,token])       

        if(result.length===0){
            return res.sendStatus(401)
        }

        if(result.deletedAt!==null){
            return res.sendStatus(406)
        }

        await db.query(`UPDATE "shortlyUrls" SET "deletedAt"=NOW() WHERE "id"=$1`,[id])
        const{rows:lalala}=await db.query(`SELECT * FROM "shortlyUrls"`)
        console.log(lalala)
        res.sendStatus(204)

    }catch(e){
        console.error(e)    
        res.sendStatus(500)
    }
}