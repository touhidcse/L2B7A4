import { prisma } from "../../lib/prisma";
import { CategoryPayload } from "./admin.interface";



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


export const adminService = {
    createNewCatagories
}