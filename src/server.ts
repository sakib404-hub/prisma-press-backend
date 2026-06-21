import app from "./app";
import config from "./config/dotenv";
import { prisma } from "./lib/prisma";
import "dotenv/config";


const PORT = config.port;

const main = async () =>{
    try{

        //? connecting to the databse
        await prisma.$connect();
        console.log("Database connected Successfully!");


        app.listen(PORT, async()=>{
            console.log(`This app is listening from port number : ${PORT}`);
        })

    }catch(err){
        console.log('Error ocuured starting the server : ', err);
        await prisma.$disconnect();
        process.exit(1);
    }
}

//? calling the main function here
main();