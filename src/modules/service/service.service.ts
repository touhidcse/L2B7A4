import { prisma } from "../../lib/prisma";
import { IServiceQuery } from "./service.interface";
import { Prisma } from "../../../generated/prisma/client";

/**
 * Get all services with filters (Public)
 * GET /api/services
 */
const getAllServicesWithFilter = async (query: IServiceQuery) => {
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || "price";
    const sortOrder = query.sortOrder || "asc";

    // Build filter conditions
    const andCondition: Prisma.ServiceWhereInput[] = [];

    // Filter by active status (default: true)
    andCondition.push({
        technician: {
            user: {
                isBan: false,
            },
        },
    });

    // Search by title or description
    if (query.searchTerm) {
        andCondition.push({
            OR: [
                {
                    title: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }

    // Filter by category
    if (query.category) {
        andCondition.push({
            category: {
                type: {
                    contains: query.category,
                    mode: "insensitive",
                },
            },
        });
    }

    // Filter by technician ID
    if (query.technicianId) {
        andCondition.push({
            technicianId: query.technicianId,
        });
    }

    // Filter by price range
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
        const priceFilter: Prisma.FloatFilter = {};
        if (query.minPrice !== undefined) {
            priceFilter.gte = query.minPrice;
        }
        if (query.maxPrice !== undefined) {
            priceFilter.lte = query.maxPrice;
        }
        andCondition.push({ price: priceFilter });
    }

    // Fetch services with pagination
    const [services, total] = await Promise.all([
        prisma.service.findMany({
            where: {
                AND: andCondition,
            },
            include: {
                category: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
                technician: {
                    include: {
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
            orderBy: {
                [sortBy]: sortOrder,
            },
            take: limit,
            skip: skip,
        }),
        prisma.service.count({
            where: {
                AND: andCondition,
            },
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