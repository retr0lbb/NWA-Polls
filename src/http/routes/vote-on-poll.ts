import { FastifyInstance } from "fastify"
import { string, z } from "zod";
import { randomUUID} from "node:crypto"
import { prisma } from "../../lib/prisma"
import { redis } from "../../lib/redis";
import { voting } from "../../utils/voting-pub-sub";

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

            const votes = await redis.zincrby(pollId, -1, userPreviusVoteOn.pollOptionId)

            voting.publish(pollId, {
                pollOptionId: userPreviusVoteOn.pollOptionId,
                votes: Number(votes)
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


        const votes = await redis.zincrby(pollId, 1, pollOptionId);

        voting.publish(pollId, {
            pollOptionId,
            votes: Number(votes)
        })

        return reply.status(200).send({ sessionId });
    });
}
