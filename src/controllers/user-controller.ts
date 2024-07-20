import { NextFunction, Request, Response } from "express";
import {
  CreateUserRequest,
  LoginUserRequest,
  UpdateUserRequest,
} from "../models/user-model";
import { UserService } from "../services/user-service";
import { UserRequest } from "../type/user-request";

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      //? body req
      const request: CreateUserRequest = req.body as CreateUserRequest;
      //? send to service
      const response = await UserService.register(request);
      //? send to client
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      //? body req
      const request: LoginUserRequest = req.body as LoginUserRequest;
      //? send to service
      const response = await UserService.login(request);
      //? send to client
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      //? send to service
      const response = await UserService.get(req.user!);
      //? send to client
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateUserRequest = req.body as UpdateUserRequest;
      const response = await UserService.update(req.user!, request);
      //? send to client
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
