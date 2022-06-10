import db from "./../app/db.js"

export async function getRanking(req,res){
    try{
        const {rows:result} = await db.query(`
        SELECT "shortlyUrls"."userId" as id, users.name, COUNT("url") as "linksCount", SUM("visitCount") as "visitCount" 
        FROM "shortlyUrls"
        JOIN users
        ON "shortlyUrls"."userId" = users.id
        WHERE "deletedAt" IS NULL
        GROUP BY "shortlyUrls"."userId",users.name
        ORDER BY "visitCount" DESC
        LIMIT 10
        `)
        
        res.status(200).send(result)

    }catch(e){
        console.error(e)
        res.sendStatus(500)
    }
}