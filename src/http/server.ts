import fastify from "fastify";
import cookie from "@fastify/cookie";
import { createPoll } from "./routes/create-polls";
import { getPoll } from "./routes/ger-polls";
import { voteOnPoll } from "./routes/vote-on-poll";
import webSocket from "@fastify/websocket";
import { pollResults } from "./ws/poll-results";
import { getAllPoll } from "./routes/get-all-polls";
import cors from "@fastify/cors";
import axios from "axios";
import "dotenv/config"

axios.defaults.withCredentials = true

const app = fastify();
app.register(cors, {
    origin: 'https://vote-now-flame.vercel.app', // just my front man >:3
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', "Access-Control-Allow-Origin"],
    credentials: true // just add this to work without http client 0w0 
    
});
app.register(cookie, {
    secret: process.env.COOKIE_SECRETE,
    hook: "onRequest",
});

app.register(webSocket);
app.register(getAllPoll);
app.register(createPoll);
app.register(getPoll);
app.register(voteOnPoll);
app.register(pollResults);

app.get("/",(request, reply) => {
    reply.send({message: "Bem Vindo a api 2"})
})

app.listen({ port: 3333 }).then(() => {
    console.log("Http Server running");
});
