import { prisma } from "../../lib/prisma"

const getPremiumContent =  async()=>{

    const posts = await prisma.post.findMany({
        where : {
     
        }
    })

}

export const PremiumServices = {
    getPremiumContent
}