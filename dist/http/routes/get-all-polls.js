"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPoll = void 0;
const prisma_1 = require("../../lib/prisma");
async function getAllPoll(app) {
    app.get("/polls", async (request, reply) => {
        const polls = await prisma_1.prisma.poll.findMany();
        if (!polls) {
            return reply.status(404).send({ message: "No polls finded" });
        }
        reply.status(200).send({ polls });
    });
}
exports.getAllPoll = getAllPoll;
