import app from "./app";
import { prisma } from "./lib/prisma";


const main = async () =>{
    try{

        //? connecting to the databse
        await prisma.$connect();
        console.log("Database connected Successfully!");


        app.listen(3000, ()=>{
            console.log('This app is listening from port number : 3000');
        })

    }catch(err){
        console.log('Error ocuured starting the server : ', err);
        await prisma.$disconnect();
        process.exit(1);
    }
}

//? calling the main function here
main();