import "express";
declare global {
    namespace Express {
        interface Request {
            user: {
                userId: string;
                email: string;
                exp?: number; // Optional expiration timestamp
                iat?: number; // Optional issued at timestamp
            }
        }
    }
}
