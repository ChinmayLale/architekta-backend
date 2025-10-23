import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/apiError";
import dotenv from 'dotenv'
import { withAccelerate } from '@prisma/extension-accelerate';
dotenv.config()

const prisma = new PrismaClient({
    // log: ['info','query','warn','error'],
    log: [{ emit: 'event', level: 'query' }],
    errorFormat: 'pretty'
}).$extends(withAccelerate())


const ConnectToDB = async () => {
    try {
        await prisma.$connect()
        console.log('✅ Database connected successfully!');
    }
    catch (error:any) {
        console.error('❌ Database connection failed ', error);
        throw new ApiError(400, "Cannot connect to DB", error.message);
    }
}


export {
    prisma,
    ConnectToDB
}