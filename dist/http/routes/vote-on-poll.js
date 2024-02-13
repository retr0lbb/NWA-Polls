"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteOnPoll = void 0;
const zod_1 = require("zod");
const node_crypto_1 = require("node:crypto");
const prisma_1 = require("../../lib/prisma");
const redis_1 = require("../../lib/redis");
const voting_pub_sub_1 = require("../../utils/voting-pub-sub");
async function voteOnPoll(app) {
    app.post("/polls/:pollId/votes", async (request, reply) => {
        const voteOnPollParams = zod_1.z.object({
            pollId: zod_1.z.string().uuid()
        });
        const voteOnPollBody = zod_1.z.object({
            pollOptionId: zod_1.z.string().uuid()
        });
        const { pollId } = voteOnPollParams.parse(request.params);
        const { pollOptionId } = voteOnPollBody.parse(request.body);
        let { sessionId } = request.cookies;
        console.log(request.cookies);
        if (!sessionId) {
            sessionId = (0, node_crypto_1.randomUUID)();
            console.log("generated Set id ", sessionId);
            reply.setCookie("sessionId", sessionId, {
                path: "/",
                maxAge: 60 * 60 * 24 * 30, // ten years
                signed: true,
                httpOnly: false
            });
        }
        if (sessionId) {
            const userPreviusVoteOn = await prisma_1.prisma.vote.findUnique({
                where: {
                    sessionId_pollId: {
                        sessionId, pollId
                    }
                }
            });
            if (userPreviusVoteOn && userPreviusVoteOn.pollOptionId !== pollOptionId) {
                console.log(userPreviusVoteOn.pollOptionId, " test ", pollOptionId);
                await prisma_1.prisma.vote.delete({
                    where: {
                        id: userPreviusVoteOn.id
                    }
                });
                const votes = await redis_1.redis.zincrby(pollId, -1, userPreviusVoteOn.pollOptionId);
                voting_pub_sub_1.voting.publish(pollId, {
                    pollOptionId: userPreviusVoteOn.pollOptionId,
                    votes: Number(votes)
                });
            }
            else if (userPreviusVoteOn) {
                return reply.status(400).send({ mesage: "You already voted on this poll" });
            }
        }
        await prisma_1.prisma.vote.create({
            data: {
                sessionId: sessionId,
                pollId: pollId,
                pollOptionId: pollOptionId
            }
        });
        const votes = await redis_1.redis.zincrby(pollId, 1, pollOptionId);
        voting_pub_sub_1.voting.publish(pollId, {
            pollOptionId,
            votes: Number(votes)
        });
        return reply.status(200).send({ sessionId });
    });
}
exports.voteOnPoll = voteOnPoll;
