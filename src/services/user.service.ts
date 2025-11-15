import { User } from "@prisma/client";
import { prisma } from "../config/db.config";
import { Optional } from "@prisma/client/runtime/library";



const getUserProfileService = async (userId: string): Promise<Optional<User> | null> => {
    try {
        if (!userId) {
            throw new Error("User ID is required");
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                projects: true,
            }
        });

        if (!user) {
            throw new Error("User Not found");
        }

        const { passwordHash, ...userWithoutPassword } = user || {};

        return userWithoutPassword;
    } catch (error) {
        console.log("Somthing Went Wrong in getUserProfileService : ");
        console.log({ error })
        return null;
    }
}




export const UserServices = {
    getUserProfileService
}