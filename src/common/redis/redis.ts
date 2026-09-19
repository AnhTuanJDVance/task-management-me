import { createClient } from "redis";

export const redisClient = createClient({
    url: "redis://localhost:6379",
});

export async function connectRedis() {

    redisClient.on("error", (err) => {
        console.error("Redis Error:", err);
    });

    await redisClient.connect();

    console.log("Redis connected");

}