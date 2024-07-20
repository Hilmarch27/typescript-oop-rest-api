import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/reponse-error";

export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ZodError) {
        res.status(400).json({
            errors: `Validations Error : ${JSON.stringify(error)}`
        })
    } else if (error instanceof ResponseError) {
        res.status(error.status).json({
            errors: error.message
        })
    } else {
        res.status(500).json({
            errors: error.message
        })
    }
}