import { FastifyInstance } from "fastify"
import { string, z } from "zod";
import { randomUUID} from "node:crypto"
import { prisma } from "../../lib/prisma"

export async function voteOnPoll(app: FastifyInstance) {
    app.post("/polls/:pollId/votes", async (request, reply) => {
        const voteOnPollParams = z.object({
            pollId: z.string().uuid()
        })
        const voteOnPollBody = z.object({
            pollOptionId: z.string().uuid()
        })
    
        const { pollId } = voteOnPollParams.parse(request.params)
        const { pollOptionId } = voteOnPollBody.parse(request.body)

        let { sessionId } = request.cookies;

        if (!sessionId) {
            sessionId = randomUUID();

            reply.setCookie("sessionId", sessionId, {
                path: "/",
                maxAge: 60 * 60 * 24 * 30, // ten years
                signed: true,
                httpOnly: true
            });
        }

        if(sessionId){
            const userPreviusVoteOn = await prisma.vote.findUnique({
                where: {
                    sessionId_pollId: {
                        sessionId, pollId
                    }
                }
            })

            if(userPreviusVoteOn && userPreviusVoteOn.pollOptionId !== pollOptionId){

                console.log(userPreviusVoteOn.pollOptionId, " test ", pollOptionId)
                await prisma.vote.delete({
                    where: {
                        id: userPreviusVoteOn.id
                    }
                })

            }else if(userPreviusVoteOn){
                return reply.status(400).send({mesage: "You already voted on this poll"})
            }
        }

        await prisma.vote.create({
            data: {
                sessionId: sessionId,
                pollId: pollId,
                pollOptionId: pollOptionId
            }
        })

        return reply.status(200).send({ sessionId });
    });
}
