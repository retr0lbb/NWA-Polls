import { FastifyInstance } from "fastify";
import { z } from "zod";
import { voting } from "../../utils/voting-pub-sub";
import { promiseHooks } from "v8";
import { get } from "http";

export async function pollResults(app: FastifyInstance) {
    app.get("/polls/:pollId/results", { websocket: true}, (connection, request) => {

        const getPollParams = z.object({
            pollId: z.string()
        })
        const { pollId } = getPollParams.parse(request.params)
        

        
        voting.subscribe(pollId, (message) => {
            connection.socket.send(JSON.stringify(message))
        })
    })
}