import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";





const registerUserIntoDB = async (payload: RegisterUserPayload) => {

    const { id, name, email, password, role, address, phone } = payload;

    const isUserExist = await prisma.user.findUnique({
        where: { email }
    })

    if (role === "ADMIN") {
        throw new Error("Admin user can not be created")
    }

    else if (role === "TECHNICIAN") {

        const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

        const createdUser = await prisma.user.create({
            data: {
                name,
                email,
                role,
                password: hashedPassword,
                address,
                phone,
                technicianProfile: {
                    create: {
                        availability: {
                            create: {
                                day: "MONDAY",
                                startTime: "09:00",
                                endTime: "17:00",
                                isAvailable: true
                            }
                        }
                    }
                },
            }
        });

        const user = await prisma.user.findUnique({
            where: {
                email: createdUser.email || email,
            },
            omit: {
                password: true
            },
            include: {
                technicianProfile: {
                    include: {
                        availability: true
                    }
                }

            }
        })

        return user;

    }
    else {

        const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

        const createdUser = await prisma.user.create({
            data: {
                name,
                email,
                role,
                password: hashedPassword,
                address,
                phone,
            }
        });

        const user = await prisma.user.findUnique({
            where: {
                email: createdUser.email || email,
            },
            omit: {
                password: true
            },
        })

        return user;

    }

};

const getMyprofileFromDB = async (userId: string) => {

    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        omit: {
            password: true,
        },
        include: {
            bookings: true,
            payments: true,
            reviews: true,
            technicianProfile: {
                include: {
                    availability: true
                }
            }
        },
    });

    return user;
}

const updateCustomerProfileIntoDB = async (userId: string, payload: any) => {
    const { name, email, phone, address, role } = payload;
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            email,
            phone,
            address
        },
        omit: {
            password: true
        },
        include: {
            bookings: true,
            payments: true,
            reviews: true
        },
    })
    return updatedUser;
}


export const userService = {
    registerUserIntoDB,
    getMyprofileFromDB,
    updateCustomerProfileIntoDB
}