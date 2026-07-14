import { prisma } from "../../lib/prisma";

const getAllCategories = async () => {

    const allCategory = await prisma.category.findMany({
        include: {
            services: true
        }
    });

    return allCategory;

}

export const categoryService ={
    getAllCategories
}