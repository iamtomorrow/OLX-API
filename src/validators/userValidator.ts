
import { checkSchema } from 'express-validator';

export const UserValidator = {

    signUp: checkSchema({
        name: {
            isAlpha: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: "Invalid name. Please, provide a valid name and try again."
        },
        email: {
            isEmail: true,
            errorMessage: "Invalid email. Please, provide a valid email and try again."
        },
        state: {
            isAlpha: true,
            errorMessage: "Invalid state. Please, provide a valid state and try again."
        },
        password: {
            isLength: {
                options: { min: 8 }
            },
            errorMessage: "Invalid password. Please, provide a valid password and try again."
        }
    }),

    signIn: checkSchema({
        email: {
            isEmail: true,
            errorMessage: "Invalid email. Please, provide a valid email and try again."
        },
        password: {
            isLength: {
                options: { min: 8 }
            },
            errorMessage: "Invalid password. Please, provide a valid password and try again."
        }
    })
}
