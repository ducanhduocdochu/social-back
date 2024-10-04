import axios from "axios";
import chalk from "chalk";
import constant from "../configs/constant";

let loggerInstance: Logger | null = null;

const sampleReq = {
  protocol: constant.app.mode === "local" ? "http" : "https",
  get: (a: string): string => {
    if (constant.app.mode === "local") {
      return `localhost:${constant.app.port}`;
    } else if (constant.app.mode === "dev") {
      return "api-dev.pambu.cloud";
    } else if (constant.app.mode === "prod") {
      return "api.udata.ai";
    }
    return "";
  },
  originalUrl: "",
};

interface LogData {
  level: string;
  message: string;
  hostname: string;
  service: string;
  timestamp: string;
  environment: string;
  _description: string;
}

interface PrintLogData {
  message: string;
  hostname: string;
  url: string;
  service: string;
  timestamp: string;
  environment: string;
  responseTime: string;
}

interface LoggerOptions {
  apiKey: string;
  logsUrl: string;
  appName: string;
  port: string;
}

class Logger {
  apiKey: string;
  logsUrl: string;
  appName: string;
  port: string;
  isConnect: boolean = false;

  LOG_LEVELS = {
    INFO: "info",
    WARN: "warn",
    ERROR: "error",
    DEBUG: "debug",
  };

  constructor({ apiKey, logsUrl, appName, port }: LoggerOptions) {
    this.apiKey = apiKey;
    this.logsUrl = logsUrl;
    this.appName = appName;
    this.port = port;
  }

  formatMessage(message: any): string {
    return Array.isArray(message) || typeof message === "object"
      ? JSON.stringify(message)
      : message;
  }

  colorizeMessage(level: string, message: string): string {
    switch (level) {
      case this.LOG_LEVELS.WARN:
        return chalk.yellow(`WARN: ${message}`);
      case this.LOG_LEVELS.ERROR:
        return chalk.red(`ERROR: ${message}`);
      case this.LOG_LEVELS.DEBUG:
        return chalk.cyan(`DEBUG: ${message}`);
      default:
        return chalk.blue(`INFO: ${message}`);
    }
  }

  createLogData(
    level: string,
    message: string,
    desc: string,
    req: typeof sampleReq
  ): LogData {
    return {
      level,
      message: message,
      hostname: req ? `${req.protocol}://${req.get("host")}` : "",
      service: `STS/${this.appName}`,
      timestamp: new Date().toISOString(),
      environment: constant.app.mode || "development",
      _description: this.formatMessage(desc),
    };
  }

  async sendLog(logData: LogData): Promise<void> {
    try {
      if (this.isConnect) {
        await axios.post(`${this.logsUrl}?api_key=${this.apiKey}`, logData);
      }
    } catch (error: any) {
      console.error("Error sending log to external service:", error.message);
    }
  }

  async testConnect(): Promise<void> {
    await axios.post(`${constant.log.logUrl}?api_key=${constant.log.apiKey}`, {
      message: "Test Datadog",
      service: `Auth-Server/${constant.app.appName}`,
    });
    this.isConnect = true;
    await this.info({ title: "Connected to Datadog" });
  }

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async retryConnect(maxRetries: number, second: number): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.testConnect();
      } catch (error: any) {
        await this.error({
          title: `Attempt to connect log system ${i + 1} failed. Retrying...`,
        });
        if (i === maxRetries - 1) {
          this.isConnect = false;
          await this.error({
            title: "Error sending log to Datadog",
            content: error.message,
          });
        }
        await this.sleep(second);
      }
    }
  }

  async log(
    level: string = this.LOG_LEVELS.INFO,
    message: string,
    desc: string,
    req: typeof sampleReq
  ): Promise<void> {
    const logData = this.createLogData(level, message, desc, req);
    const coloredMessage = this.colorizeMessage(level, logData.message);
    console.log(coloredMessage);
    await this.sendLog(logData);
  }

  async info(
    { title, content = "" }: { title: string; content?: string },
    req: typeof sampleReq = sampleReq
  ): Promise<void> {
    await this.log(this.LOG_LEVELS.INFO, title, content, req);
  }

  async warn(
    { title, content = "" }: { title: string; content?: string },
    req: typeof sampleReq = sampleReq
  ): Promise<void> {
    await this.log(this.LOG_LEVELS.WARN, title, content, req);
  }

  async error(
    { title, content = "" }: { title: string; content?: string },
    req: typeof sampleReq = sampleReq
  ): Promise<void> {
    await this.log(this.LOG_LEVELS.ERROR, title, content, req);
  }

  async debug(
    { title, content = "" }: { title: string; content?: string },
    req: typeof sampleReq = sampleReq
  ): Promise<void> {
    await this.log(this.LOG_LEVELS.DEBUG, title, content, req);
  }
}

export async function initLogger(): Promise<Logger | null> {
  const { apiKey, logUrl } = constant.log;
  const { appName, port } = constant.app;
  if (apiKey && logUrl && appName && port) {
    const logger = new Logger({
      apiKey,
      logsUrl: logUrl,
      appName: appName,
      port: port,
    });

    loggerInstance = logger;

    try {
      await logger.info({
        title: "Logger initialized successfully with Terminal",
      });

      await logger.retryConnect(3, 5000);
    } catch (error: any) {
      await logger.error({
        title: "Failed to initialize logger with Datadog",
        content: error.message,
      });
    }

    return loggerInstance;
  } else {
    console.log("Fail to logger initialized with Terminal")
    return null
  }
}

export const logger = (): Logger | null => loggerInstance;
