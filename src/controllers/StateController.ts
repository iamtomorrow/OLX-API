
import { State } from "../models/State";
import { Response, Request } from "express"

export const StateController = {
    getStates: async ( req: Request, res: Response ) => {
        let result = await State.find();
        res.json({ result });
    }
}
