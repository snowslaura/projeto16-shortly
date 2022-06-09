import signUpSchema from "./../schemas/signUpSchema.js";
import signInSchema from "../schemas/signInSchema.js";

export function signUpValidator (req,res,next){

    const {name,email,password,confirmPassword} = req.body

    const {error} = signUpSchema.validate({name, email, password, confirmPassword})

    if(error){
        return res.status(422).send(error.details);
    } 
     
    next();
}

export function signInValidator(req,res,next){

    const {email,password} = req.body

    const {error} = signInSchema.validate({email, password})
    
    if(error){
        return res.status(422).send(error.details);
    }  

    next();
}