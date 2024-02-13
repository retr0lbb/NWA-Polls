"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const create_polls_1 = require("./routes/create-polls");
const ger_polls_1 = require("./routes/ger-polls");
const vote_on_poll_1 = require("./routes/vote-on-poll");
const websocket_1 = __importDefault(require("@fastify/websocket"));
const poll_results_1 = require("./ws/poll-results");
const get_all_polls_1 = require("./routes/get-all-polls");
const cors_1 = __importDefault(require("@fastify/cors"));
require("dotenv/config");
const app = (0, fastify_1.default)();
app.register(cors_1.default, {
    origin: 'http://localhost:5173', // just my front man >:3
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true // just add this to work without http client 0w0 
});
app.register(cookie_1.default, {
    secret: process.env.COOKIE_SECRETE,
    hook: "onRequest",
});
app.register(websocket_1.default);
app.register(get_all_polls_1.getAllPoll);
app.register(create_polls_1.createPoll);
app.register(ger_polls_1.getPoll);
app.register(vote_on_poll_1.voteOnPoll);
app.register(poll_results_1.pollResults);
app.listen({ port: 3333 }).then(() => {
    console.log("Http Server running");
});
