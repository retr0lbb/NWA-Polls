import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";


export async function getAllPoll(app: FastifyInstance){
    app.get("/polls", async(request, reply) => {


        const polls = await prisma.poll.findMany()

        if(!polls){
            return reply.status(404).send({message: "No polls finded"})
        }

        reply.status(200).send({ polls })

    })
}