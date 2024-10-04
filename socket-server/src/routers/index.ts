import express, { Router } from 'express';
import testRouter from './test.router'; 

const router: Router = express.Router(); 

router.use('/test', testRouter);

export default router;
