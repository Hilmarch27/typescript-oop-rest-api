import express from 'express';
import { authMiddleware } from '../middlewares/auth-middleware';
import { UserController } from '../controllers/user-controller';

export const apiRouter = express.Router();
apiRouter.use(authMiddleware)

// user api
apiRouter.get("/api/users/current", UserController.get)
apiRouter.patch("/api/users/current", UserController.update)