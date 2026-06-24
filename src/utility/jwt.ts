import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken"

const createToken = (jwtPayLoad: JwtPayload, secret: string, expiresIn: SignOptions) => {

    const token = jwt.sign(jwtPayLoad, secret, { expiresIn } as SignOptions);

    return token;
};


const verifyToken = (token: string, secret: string) => {
    try {

        const verifyToken = jwt.verify(token, secret);
        return verifyToken;

    } catch (err) {

        throw new Error("Invalid Token");

    }
}

const jwtutils = {
    createToken,
    verifyToken
}

export default jwtutils;