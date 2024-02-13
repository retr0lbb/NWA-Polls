"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
require("dotenv/config");
exports.redis = new ioredis_1.default({
    password: process.env.REDIS_PASS,
    host: 'redis-16226.c308.sa-east-1-1.ec2.cloud.redislabs.com',
    port: 16226
});
exports.redis.on("ready", () => {
    console.log("A conexão está pronta");
});
exports.redis.on('error', function (err) {
    console.log('Erro de Redis:', err);
});
