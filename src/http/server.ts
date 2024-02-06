import fastify from "fastify"
import cookie from "@fastify/cookie"
import { createPoll } from "./routes/create-polls"
import { getPoll } from "./routes/ger-polls"
import { voteOnPoll } from "./routes/vote-on-poll"

const app = fastify()

app.register(cookie, {
    secret: "MELAN",
    hook: "onRequest",
})

app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)

app.listen({ port: 3333 }).then(() => {
    console.log("Http Server running")
})
