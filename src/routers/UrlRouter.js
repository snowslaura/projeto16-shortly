import express from "express";

import { tokenValidator, urlValidator } from "../middlewares/postUrlMiddlewares.js";

import { postUrl, getUrl, getShortUrl, deleteShortUrl } from "../controllers/urlControllers.js";

const urlRouter = express.Router();

urlRouter.post('/urls/shorten', tokenValidator, urlValidator, postUrl )
urlRouter.get('/urls/:id', getUrl)
urlRouter.get('/urls/open/:shortUrl', getShortUrl)
urlRouter.delete('/urls/:id', tokenValidator, deleteShortUrl)

export default urlRouter;