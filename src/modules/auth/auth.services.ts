import config from "../../config/dotenv";
import { prisma } from "../../lib/prisma";
import { AuthPayLoad } from "./auth.interface";
import bcrypt from "bcrypt"
import jwt, { SignOptions } from "jsonwebtoken"


const longinUser = async (payLoad: AuthPayLoad) => {
    const { email, password } = payLoad;

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email
        }
    })

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error("Password is Incorrect!");
    }

    //? password is matched now we will generate an access token
    const jwtPayLoad = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }

    console.log(typeof config.jwt_access_token_expiration);
    console.log(typeof config.jwt_refresh_token_expiration);
    console.log(config.jwt_access_token_expiration);
    console.log(config.jwt_refresh_token_expiration);

    const accessToken = jwt.sign(jwtPayLoad, config.jwt_secret,
        {
            expiresIn: config.jwt_access_token_expiration
        } as SignOptions
    );

    //? generating the refresh token
    const refreshToken = jwt.sign(jwtPayLoad, config.jwt_refresh_secret,
        {
            expiresIn: config.jwt_refresh_token_expiration
        } as SignOptions
    )

    return {
        accessToken,
        refreshToken
    };
}

const authServices = {
    longinUser
}

export default authServices;