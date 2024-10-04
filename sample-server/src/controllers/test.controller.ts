import { Request, Response, NextFunction } from 'express';
import { CREATED, SuccessResponse } from '../core/success.reponse';
import TestService from '../services/test.service';

class AuthController {
    test = async (req: Request, res: Response, next: NextFunction) => {
        new CREATED({
            message: 'Test successfully!',
            metadata: await TestService.test(),
        }).send(res);
    };
}

export default new AuthController();
