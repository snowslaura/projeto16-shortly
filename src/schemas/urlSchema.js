import joi from "joi"

const urlSchema = joi.object({
    url: joi
    .string()
    .required()
    .pattern(new RegExp('((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)')),
})

export default urlSchema;