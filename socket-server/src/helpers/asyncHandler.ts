// src/helpers/asyncHandler.ts

import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * asyncHandler là một hàm bọc (wrapper) để xử lý các route handler bất đồng bộ
 * và tự động chuyển các lỗi đến middleware xử lý lỗi của Express.
 * 
 * @param fn - Một route handler bất đồng bộ
 * @returns Một RequestHandler
 */
const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};

export default asyncHandler;
