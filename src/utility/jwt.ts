import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken"

const createToken = (jwtPayLoad: JwtPayload, secret: string, expiresIn: SignOptions) => {

    const token = jwt.sign(jwtPayLoad, secret, { expiresIn } as SignOptions);

    return token;
};

const jwtutils = {
    createToken
}

export default jwtutils;