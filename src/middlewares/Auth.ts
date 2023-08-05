
import { User } from "../models/User";
import { NextFunction, Request, Response } from "express";

const AuthorizeToken = async ( tkn: string ) => {
    let user = await User.findOne({ token: tkn });

    if (user !== null) {
        return true;
    } 
    return false;
}

export const Auth = {
    private: async ( req: Request, res: Response, next: NextFunction ) => {
        let authorized = false;
        if ( req.body !== undefined && req.query !== undefined ) {
            if ( req.body.body !== undefined ) {
                let { token } = req.body.body;
                authorized = await AuthorizeToken( token as string );
            } else {
                let token: string = req.query.token as string;
                authorized = await AuthorizeToken( token );
            }
        } 
        authorized ? next() : res.json({ error: "Forbidden" });
    }
}
