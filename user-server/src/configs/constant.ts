"use strict";
import dotenv from 'dotenv';

// Cấu hình dotenv
dotenv.config();

// Định nghĩa kiểu cho cấu hình ứng dụng và database
interface DBConfig {
  url: string | undefined;
}

interface NoDBConfig {
  url: string | undefined;
  set: string | undefined;
  dbName: string | undefined;
}

// Định nghĩa kiểu cho cấu hình ứng dụng và database
interface LogConfig {
  apiKey: string | undefined;
  logUrl: string | undefined;
}

interface AppConfig {
  mode: string | undefined;
  port: string | undefined;
  appName: string | undefined;
}

interface EnvConfig {
  app: AppConfig;
  db: DBConfig;
  log: LogConfig;
  nodb: NoDBConfig;
}

// Cấu hình cho môi trường phát triển (dev)
const constant: EnvConfig = {
  app: {
    mode: process.env.NODE_ENV,
    port: process.env.APP_PORT,
    appName: process.env.APP_NAME,
  },
  db: {
    url: process.env.POSTGRES_URL,
  },
  log: {
    apiKey: process.env.DATADOG_API_KEY,
    logUrl: process.env.DATADOG_LOGS_URL,
  },
  nodb: {
    url: process.env.MONGO_CLUSTER_URL,
    set: process.env.MONGO_DB_REPLICA_SET,
    dbName: process.env.MONGO_DB_NAME,
  }
};

// Xuất cấu hình môi trường
export default constant;
