import db from "../app/db.js";

export async function getUsers(req,res){
    const {id} = req.params
    try{
        const {rows:result} = await db.query(`
        SELECT SUM("visitCount") as "visitCount", users.name , users.id
        FROM "shortlyUrls" 
        JOIN users
        ON "shortlyUrls"."userId" = users.id
        WHERE "userId"=$1 AND "deletedAt" IS NULL
        GROUP BY "shortlyUrls"."userId", users.name , users.id`,[id])     
        
        if(result.length===0){
            return res.sendStatus(404)  //PERGUNTAR AO TUTOR SE É ESSE O STATUS
        }

        const {rows:shortenedUrls} = await db.query(`
        SELECT "shortlyUrls".id, "shortlyUrls"."shortUrl", "shortlyUrls".url, "shortlyUrls"."visitCount"
        FROM "shortlyUrls" 
        WHERE "userId"=$1 AND "deletedAt" IS NULL`,[id])        

        if(shortenedUrls.length===0){
            return res.sendStatus(404)  //PERGUNTAR AO TUTOR SE É ESSE O STATUS
        }
        
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