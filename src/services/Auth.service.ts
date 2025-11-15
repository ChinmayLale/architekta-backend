import { prisma } from "../config/db.config";
import { Provider, User } from "@prisma/client";
import bcrypt from 'bcrypt';
// import { jwtPayload } from "../types/index";
import Jwt from "jsonwebtoken";




const loginUserService = async (email: string, provider: Provider, password?: string): Promise<User | null> => {
    if (provider === "EMAIL" && !password) {
        throw new Error("Password is required for EMAIL provider.");
    }

    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
        include: {
            projects: true
        }
    });

    if (!user) {
        throw new Error("User not found.");
    }

    if (provider === "EMAIL") {
        const isValidPassword = await bcrypt.compare(password!, user.passwordHash!);
        if (!isValidPassword) {
            throw new Error("Invalid password.");
        }
    }

    if (user.provider !== provider) {
        return null;
    }

    return user;
}


const signupUserService = async (userData: Partial<User>): Promise<User> => {
    if (!userData?.email || !userData?.provider) {
        throw new Error("Email and Provider are required fields.");
    }

    if (userData.provider === "EMAIL" && !userData.passwordHash) {
        throw new Error("Password is required for EMAIL provider.");
    }

    // ✅ Explicitly assert that password is a string
    const plainPassword = userData.passwordHash as string;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const isExistingUser = await prisma.user.findUnique({
        where: {
            email: userData.email
        }
    });

    if (isExistingUser) {
        throw new Error("User with this email already exists.");
    }

    const newUser = await prisma.user.create({
        data: {
            displayName: userData.displayName || "",
            email: userData.email,
            provider: userData.provider as Provider,
            passwordHash: hashedPassword, // ✅ use hashed one
            isPremium: false,
        },
    });

    const { passwordHash, ...safeUser } = newUser;

    return safeUser as User;
};

export interface jwtPayload {
    userId: string;
    email: string;
    provider: Provider;
}

const createJwtToken = async (data: jwtPayload): Promise<string> => {

    const newJwt = Jwt.sign(data, process.env['JWT_SECRET_KEY'] as string, { expiresIn: '10h' });

    return newJwt;
}


export const authService = {
    loginUserService,
    signupUserService,
    createJwtToken
}
