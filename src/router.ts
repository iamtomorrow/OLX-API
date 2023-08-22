
import express from 'express';
import multer from "multer";
import { Request, Response, urlencoded } from "express";
import { StateController } from "./controllers/StateController";
import { UserController } from "./controllers/UserController";
import { Router } from "express";
import { Auth } from "./middlewares/Auth";
import { UserValidator } from "./validators/userValidator";
import { AdController } from "./controllers/AdController";
import { EmailController } from './controllers/EmailController';

export const router = Router( );
const upload = multer({ dest: "tmp" });

router.get("/ping", ( req: Request, res: Response ) => {
    res.json({ pong: "pong" })
});
/*  */
router.get("/states", StateController.getStates);

router.post("/users/signup", 
    express.json(),
    express.urlencoded({ extended: true }),
    UserValidator.signUp, 
    UserController.signUp);

router.post("/users/signin", 
    express.json(),
    express.urlencoded({ extended: true }), 
    UserValidator.signIn, 
    UserController.signIn);
router.get("/users/me", Auth.private, UserController.getMe);
router.delete("/users/delete", Auth.private, UserController.deleteMe);
router.put("/users/editme", Auth.private, UserController.editMe);
router.get("/user", UserController.getUser);

router.get("/categories", AdController.getCategories);

router.get("/ads", urlencoded({ extended: true }), AdController.getAds );

router.get("/ads/myads", 
    Auth.private, 
    express.json(), 
    express.urlencoded({ extended: true }), 
    AdController.getUserAds);

router.get("/ads/:id", 
    express.urlencoded({ extended: true }), 
    AdController.getAd
);

router.post("/ads/create", 
    express.urlencoded({ extended: true }), 
    express.json(),
    Auth.private, 
    upload.array("images"),
    AdController.postAd
);
