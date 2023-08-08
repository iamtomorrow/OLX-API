
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
        if ( req.body !== undefined || req.query !== undefined ) {
            if ( req.query !== undefined ) {
                let token: string = req.query.token as string;
                // console.log(token);
                authorized = await AuthorizeToken( token );
            } else {
                let { token } = req.body.body;
                // console.log(token);
                authorized = await AuthorizeToken( token as string );
            }
        } 
        authorized ? next() : res.json({ error: "Forbidden" });
    }
}
