
import { hash, compare } from 'bcrypt';
import { Ad } from '../models/Ad';
import { State } from "../models/State";
import { User } from "../models/User";
import { Response, Request } from "express"
import { validationResult, matchedData } from "express-validator";
import { Category } from '../models/Category';

export const UserController = {
    signUp: async ( req: Request, res: Response ) => {
        const error = validationResult(req);
        const result = matchedData(req);

        if (error.isEmpty()) {

            const { name, email, state, password } = result;
            let checkState = await State.findOne({ name: state.toUpperCase() });
            if (checkState !== null) {
                    
                const state_id = checkState._id;
                let checkEmail = await User.findOne({ email });
                if ( checkEmail === null ) {

                    const passwordHash = await hash(password, 10);
                    const token = await hash(Date.now() + Math.floor(Math.random() * 10).toString(), 10);      
                    let newUser = User.create({
                        name,
                        email,
                        state: state_id,
                        date_created: Date(),
                        hash_password: passwordHash,
                        token
                    })
                    res.json({ state: "Success", email, token });
                    return;
                } else {
                    res.json({ error: { email: "The provided email already exists. Please, provide a different email and try again." } });
                    return;
                }
            } else {
                res.json({ error: { state: `The provided state ${state.toUpperCase()} doesn't match any state available. Please, provide a different state and try again.` } });
                return;
            }               
        } else {
            res.json({ error });
            return;
        }
    },

    signIn: async ( req: Request, res: Response ) => {
        const error = validationResult(req);
        const result = matchedData(req);
        
        console.log( matchedData(req) );
        
        if ( error.isEmpty() ) {

            const { email, password } = result;
            let matchUser = await User.findOne({ email });
            if (matchUser !== null) {
                
                const passwordHash = matchUser.hash_password;
                const matchPasswordHash = await compare(password, passwordHash as string);
                if (matchPasswordHash) {
                    
                    const token = await hash(Date.now() + Math.floor(Math.random() * 10).toString(), 10);
                    matchUser.token = token;
                    matchUser.save();
                    res.json({ status: "Success", email: matchUser.email, token });
                    return;
                } else {
                    res.json({ error: "Sorry, email or password provided are wrong! Please, provide a different email and/or password and try again." });
                    return;
                }
            } else {
                res.json({ error: "Sorry, email or password provided are wrong! Please, provide a different email and/or password and try again." });
                return;
            }
        } else {
            res.json({ error });
            return;
        }
    },

    getMe: async ( req: Request, res: Response ) => {
        const { token } = req.query;

        let user = await User.findOne({ token });
        if ( user ) {
            let userList = [];
            let adsList: any = [];
    
            const state = await State.findOne({ _id: user.state });
            const ads = await Ad.find({ id_user: user._id });
    
            if (state && ads) {
                for ( let i in ads ) {
                    let cat = await Category.findById(ads[i].category);
                    adsList.push({
                        name: ads[i].name,
                        state: state.name,
                        category: cat?.slug,
                        price: ads[i].price,
                        price_negotiable: ads[i].price_negotiable,
                        description: ads[i].description,
                        views:  ads[i].views,
                        status: ads[i].status
                    })
                }

                userList.push({
                    user: user.name,
                    email: user.email,
                    state: state.name,
                    ads: adsList
                })

                res.json({ user: userList });
                return;
            }
        }
        res.json({ status: true });
    },

    getUser: async ( req: Request, res: Response ) => {
        const { id } = req.query;

        if (id) {
            let user = await User.findById(id);
            if (user) {
                let state = await State.findOne({ _id: user.state });
                if (state) {
                    res.json({ name: user.name, email: user.email, state: state.name });
                    return;
                }
            } else {
                res.json({ error: "Sorrry, advertiser not found." });
                return;
            }
        } else {
            res.json({ });
            return;
        }
    }
}
