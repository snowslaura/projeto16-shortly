import urlSchema from "../schemas/urlSchema.js";

export function tokenValidator(req,res,next){
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token){
        return res.sendStatus(401)
    } 
    res.locals.token = token;
    next();
}

export function urlValidator(req,res,next){
    const {url} = req.body    
    const {error} = urlSchema.validate({url})
    if(error){
       return res.status(422).send(error.details)
    } 
    res.locals.url = url
    next();
}