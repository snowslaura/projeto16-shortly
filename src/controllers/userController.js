import db from "../app/db.js";

export async function getUsers(req,res){
    const {id} = req.params
    try{
        const {rows:result} = await db.query(`
        SELECT users.id, users.name , COALESCE(SUM("shortlyUrls"."visitCount"),0) AS "visitCount"
        FROM users
        LEFT JOIN "shortlyUrls"
        ON "shortlyUrls"."userId" = users.id
        WHERE "deletedAt" is NULL AND users.id=$1
        GROUP BY users.id`,[id])
        
        if(result.length===0){
           return res.sendStatus(404)
        }
        
       
        const {rows:shortenedUrls} = await db.query(`
        SELECT "shortlyUrls".id, "shortlyUrls"."shortUrl", "shortlyUrls".url, "shortlyUrls"."visitCount"
        FROM "shortlyUrls" 
        WHERE "userId"=$1 AND "deletedAt" IS NULL`,[id])        
       
        const totalUserCount = {
            "id":result[0].id,
            "name":result[0].name,
            "visitCount":result[0].visitCount
        }

        const response = {...totalUserCount, "shortenedUrls":shortenedUrls}
        res.status(200).send(response)
    }catch(e){
        console.error(e)
        res.sendStatus(500)
    }
}