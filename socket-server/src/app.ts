import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import { checkOverload } from './helpers/check.connect';
import { initLogger, logger } from './loggers/log';
import cors from 'cors';
import router from './routers';
import { connectMongoDB, connectPostgres, connectRedis } from './configs';

// Khởi tạo app
const app = express();

// Khởi tạo logger
initLogger().then(() => {
  const log = logger();
  if (log) {
    log.info({ title: 'Logger initialized' });
  }
});

// Khởi tạo middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  bodyParser.json({ limit: '1mb' })(req, res, (err) => {
    if (err) {
      if (err.type === 'entity.too.large') {  // Kiểm tra kiểu lỗi 'entity.too.large'
        res.status(413).json({
          status: 'error',
          code: 413,
          message: 'Request body is too large',
        });
      } else {
        next(err);  // Nếu lỗi không phải là do kích thước, chuyển tiếp lỗi
      }
    } else {
      next();  // Không có lỗi, tiếp tục
    }
  });
});

// Uncomment nếu bạn muốn dùng hàm checkOverload
// checkOverload();

// Initialize database connections
const initDatabaseConnections = async () => {
  try {
    // Initialize MongoDB connection
    await connectMongoDB();

    // Initialize Redis connection
    await connectRedis();

    // Initialize PostgresSQL
    await connectPostgres();

  } catch (error: any) {
    console.error('Database connection error:', error.message);
    process.exit(1);  // Exit process if database connection fails
  }
};
initDatabaseConnections()

// Khởi tạo routes
app.use('/v1/api', router);

// Middleware xử lý "Not Found"
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error('Not Found');
  (error as any).status = 404;
  next(error);
});

// Middleware xử lý lỗi chung
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  res.status(status).json({
    status: 'error',
    code: status,
    message: error.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, // Chỉ hiển thị stack khi ở môi trường phát triển
  });
});

export default app;
