import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";





const registerUserIntoDB = async (payload: RegisterUserPayload) => {

    const { name, email, password, role, bio} = payload;

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
                technicianProfile: {
                    create: {
                        bio
                    }
                }
            }
        });

        const user = await prisma.user.findUnique({
            where: {
                id: createdUser.id,
                email: createdUser.email || email,
            },
            omit: {
                password: true
            },
            include:{
                technicianProfile: true
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
            }
        });

        const user = await prisma.user.findUnique({
            where: {
                id: createdUser.id,
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
         include:{
            bookings: true,
            payments:true,
            reviews:true
        },
    });

    return user;
}

const updateCustomerProfileIntoDB = async (userId: string, payload: any)=>{
    const {name, email,phone,address,role}=payload;

    if(role !=="CUSTOMER"){
        throw new Error("You are not a Customer, pls register and login as customer")
    }
    const updatedUser= await prisma.user.update({
        where:{ id: userId},
        data: {
            name,
            email,
            phone,
            address
        },
        omit:{
            password: true
        },
        include:{
            bookings: true,
            payments:true,
            reviews:true
        },
    })
    return updatedUser;
}


export const userService = {
    registerUserIntoDB,
    getMyprofileFromDB,
    updateCustomerProfileIntoDB
}