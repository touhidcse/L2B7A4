import { prisma } from "../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { ServiceFilter } from "./service.interface";

/**
 * Get all services with filters (Public)
 * GET /api/services
 */

const getAllServicesWithFilter = async (
    query: ServiceFilter
) => {

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;


    const technicianFilter: Prisma.TechnicianProfileWhereInput = {
        user: {
            isBan: false,
        },
    };


    // Filter by technician location
    if (query.location) {
        technicianFilter.location = {
            contains: query.location,
            mode: "insensitive",
        };
    }


    // Filter by minimum rating
    if (query.rating !== undefined) {
        technicianFilter.rating = {
            gte: query.rating,
        };
    }


    const where: Prisma.ServiceWhereInput = {
        technician: technicianFilter,
    };


    // Filter by category type
    if (query.type) {
        where.category = {
            type: {
                contains: query.type,
                mode: "insensitive",
            },
        };
    }



    const [services, total] = await Promise.all([

        prisma.service.findMany({

            where,

            include: {

                category: {
                    select: {
                        id: true,
                        type: true,
                    },
                },


                technician: {
                    select: {

                        id: true,
                        location: true,
                        rating: true,


                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },

            },


            skip,
            take: limit,


            orderBy: {
                price: "asc",
            },

        }),



        prisma.service.count({
            where,
        }),

    ]);



    return {

        data: services,

        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },

    };
};

export const serviceService = {
    getAllServicesWithFilter
};