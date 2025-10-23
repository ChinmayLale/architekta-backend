// src/middleware/globalErrorHandler.ts
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

class ApiError extends Error {
    public statusCode: number;
    public error: string;
    public success: boolean;

    constructor(statusCode: number, message = "Something went wrong", error = "Unexpected Error") {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.success = false;
        this.error = error;

        Error.captureStackTrace(this, this.constructor);
    }
}

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            success: err.success,
            error: err.error,
            message: err.message,
        });
    }

    if (err instanceof PrismaClientKnownRequestError) {
        let message = "Database error";
        let error = err.message;
        let statusCode = 400;

        switch (err.code) {
            case "P2002":
                message = `Unique constraint failed on the field: ${err.meta?.['target']}`;
                error = "Unique constraint violation";
                break;
            case "P2025":
                message = "Record not found";
                statusCode = 404;
                break;
        }

        return res.status(statusCode).json({
            status: statusCode,
            success: false,
            error,
            message,
        });
    }

    return res.status(500).json({
        status: 500,
        success: false,
        error: err.message || "Something went wrong",
        message: "Internal Server Error",
    });
};

export { ApiError, globalErrorHandler };
