import Redis from 'ioredis';
import "dotenv/config"

export const redis = new Redis({
    password: process.env.REDIS_PASS,
    host: 'redis-16226.c308.sa-east-1-1.ec2.cloud.redislabs.com',
    port: 16226
});

redis.on("ready", () => {
    console.log("A conexão está pronta")
})

redis.on('error', function (err) {
    console.log('Erro de Redis:', err);
});
