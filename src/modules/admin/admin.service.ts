import { prisma } from "../../lib/prisma";
import { CategoryPayload, UpdateUserStatusPayload } from "./admin.interface";



const createNewCatagories = async (payload: CategoryPayload) => {
    const { id, name } = payload;
    const iscategoryExist = await prisma.category.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive"
            }
        }
    })

    if (iscategoryExist) {
        throw new Error("category already exist")
    }
    const createdCategory = await prisma.category.create({
        data: {
            name
        }
    });

    const category = await prisma.category.findUnique({
        where: {
            name: createdCategory.name || name,
        },

        include: {
            services: true,

        }
    })
    return category;
}

const getAllCategories = async () => {

    const allCategory = await prisma.category.findMany({
        include: {
            services: true
        }
    });

    return allCategory;

}
const getAllusers = async () => {

    const alluser = await prisma.user.findMany({
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
        }
    })

    return alluser;

};

const updateUserStatus = async (id: string, payload : UpdateUserStatusPayload) => {
   
    const updateStatus = await prisma.user.update({
        where: { id},
        data: {
            isBan: payload.isBan
        },
        omit: {
            password: true
        },
        include: {
            bookings: true,
            payments: true,
            reviews: true,
            technicianProfile:{
                include:{
                    availability: true
                }
            }
        },
    })
    return updateStatus;


}
const getAllBookings = async () => {

    const allBookings = await prisma.booking.findMany({
    })

    return allBookings;

}

export const adminService = {
    createNewCatagories,
    getAllCategories,
    getAllusers,
    updateUserStatus,
    getAllBookings
}