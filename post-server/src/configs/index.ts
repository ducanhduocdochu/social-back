import Redis from "ioredis"; 
import { URL } from "url"; 
import { logger } from "../loggers/log";
import mongoose from "mongoose";
import constant from "./constant";
import { Client } from "pg";

const NODE_ENV = process.env.NODE_ENV || "local";
const LOCAL_REDIS_URL = process.env.LOCAL_REDIS_URL || "redis://localhost:6379";

// Hàm kết nối MongoDB
export const connectMongoDB = async (): Promise<void> => {
  if (NODE_ENV === "local") {
    return connectMongoDBLocal();
  }

  try {
    await mongoose.connect(
      `${constant.nodb.url}/${constant.nodb.dbName}?tls=true&authSource=admin&replicaSet=${constant.nodb.set}`
    );
    logger()?.info({ title: "Connected to MongoDB!" });
  } catch (error) {
    console.error(error);
    logger()?.error({ title: "Connection to MongoDB failed", content: String(error) });
  }
};

// Hàm kết nối MongoDB ở môi trường local
export const connectMongoDBLocal = async (): Promise<void> => {
  try {
    await mongoose.connect(`${constant.nodb.url}/warning`);
    logger()?.info({ title: "Connected to LOCAL MongoDB!" });
  } catch (error) {
    logger()?.error({ title: "Connection to LOCAL MongoDB failed", content: String(error) });
  }
};

// Hàm kết nối Redis
export const connectRedis = async (): Promise<void> => {
  if (NODE_ENV === "local") {
    return connectRedisInLocal();
  }

  return new Promise((resolve, reject) => {
    const local_redisClient = new Redis({
      name: "mymaster",
      sentinels: [
        {
          host: new URL(LOCAL_REDIS_URL).hostname,
          port: Number(new URL(LOCAL_REDIS_URL).port) || 26379, // Default Sentinel port
        },
      ],
    });

    local_redisClient.on("error", (err: Error) => {
      logger()?.error({ title: 'Error connecting to LOCAL Redis', content: err.message });
      reject(err);
    });

    local_redisClient.on("connect", () => {
      logger()?.info({ title: 'Connected to LOCAL Redis!' });
      // global.local_redisClient = local_redisClient;
      resolve();
    });
  });
};

// Hàm kết nối Redis trong môi trường local
export const connectRedisInLocal = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const redisClient = new Redis({
      host: "127.0.0.1",
      port: 6379,       
    });

    redisClient.on("error", (err: Error) => {
      logger()?.error({ title: 'Error connecting to LOCAL Redis', content: err.message });
      reject(err);
    });

    redisClient.on("connect", () => {
      logger()?.info({ title: 'Connected to LOCAL Redis!' });
      global.local_redisClient = redisClient;
      resolve();
    });
  });
};

// S3 Client initialization
// import { S3Client } from '@aws-sdk/client-s3';

// export const s3 = new S3Client({
//   region: process.env.DO_SPACE_REGION,
//   endpoint: process.env.DO_SPACE_END_POINT_UPLOAD,
//   credentials: {
//     accessKeyId: process.env.DO_SPACE_ACCESS_KEY_UPLOAD,
//     secretAccessKey: process.env.DO_SPACE_SECRET_KEY_UPLOAD,
//   },
// });

// Hàm kết nối PostgreSQL
export const connectPostgres = async (): Promise<void> => {
  if (NODE_ENV === "local") {
    return connectPostgresLocal();
  }

  const client = new Client({
    connectionString: constant.db.url,
  });

  try {
    await client.connect();
    logger()?.info({ title: "Connected to PostgreSQL!" });
    // global.postgresClient = client;
  } catch (error) {
    logger()?.error({ title: "Connection to PostgreSQL failed", content: String(error) });
  }
};

// Hàm kết nối PostgreSQL trong môi trường local
export const connectPostgresLocal = async (): Promise<void> => {
  const localClient = new Client({
    connectionString: "postgresql://postgres:123456@localhost:5432/test",
  });

  try {
    await localClient.connect();
    logger()?.info({ title: "Connected to LOCAL PostgreSQL!" });
    // global.local_postgresClient = localClient;
  } catch (error) {
    console.log(error)
    logger()?.error({ title: "Connection to LOCAL PostgreSQL failed", content: String(error) });
  }
};

