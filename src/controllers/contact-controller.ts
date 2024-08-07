import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user-request";
import { CreateContactRequest } from "../models/contact-mode";
import { ContactService } from "../services/contact-service";

export class ContactController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateContactRequest = req.body as CreateContactRequest;

      const response = await ContactService.create(req.user!, request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
