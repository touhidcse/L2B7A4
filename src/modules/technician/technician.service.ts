import { prisma } from "../../lib/prisma";
import { BookingStatus, DayOfWeek } from "../../../generated/prisma/enums";

/**
 * Get all technicians with filters (Public)
 * GET /api/technicians
 */
const getAllTechniciansWithFilter = async (filters: any, page: number = 1, limit: number = 10) => {
    const where: any = {
        user: {
            isBan: false,
        },
    };

    // Filter by category
    if (filters.category) {
        where.services = {
            some: {
                category: {
                    name: {
                        contains: filters.category,
                        mode: 'insensitive',
                    },
                },
            },
        };
    }

    // Filter by location
    if (filters.location) {
        where.location = {
            contains: filters.location,
            mode: 'insensitive',
        };
    }

    // Filter by search (name or skills)
    if (filters.search) {
        where.OR = [
            {
                user: {
                    name: {
                        contains: filters.search,
                        mode: 'insensitive',
                    },
                },
            },
            {
                name: {
                    contains: filters.search,
                    mode: 'insensitive',
                },
            },
            {
                bio: {
                    contains: filters.search,
                    mode: 'insensitive',
                },
            },
        ];
    }

    // Filter by min rating
    if (filters.minRating) {
        where.rating = {
            gte: parseFloat(filters.minRating),
        };
    }

    // Filter by availability
    if (filters.isAvailable === 'true') {
        where.isAvailable = true;
    }

    const skip = (page - 1) * limit;

    const [technicians, total] = await Promise.all([
        prisma.technicianProfile.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        address: true
                    },
                },
                services: {
                    include: {
                        category: true,
                    },
                },
                availability: {
                    orderBy: {
                        day: 'asc',
                    },
                },
                reviews: {
                    orderBy: {
                        rating: 'desc',
                    },
                    take: 5,
                    include: {
                        customer: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        bookings: {
                            where: {
                                status: 'COMPLETED',
                            },
                        },
                    },
                },
            },
            orderBy: {
                rating: 'desc',
            },
            skip,
            take: limit,
        }),
        prisma.technicianProfile.count({ where }),
    ]);

    // Calculate average rating for each technician
    const techniciansWithRating = technicians.map((tech) => {
        const totalReviews = tech.reviews.length;
        const avgRating = totalReviews > 0
            ? tech.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            : 0;

        return {
            ...tech,
            averageRating: avgRating,
            totalReviews,
            completedJobs: tech._count.bookings,
        };
    });

    return {
        technicians: techniciansWithRating,
        meta: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get technician profile with reviews (Public)
 * GET /api/technicians/:id
 */
const getTechnicianProfileWithReviews = async (technicianId: string) => {
    const technician = await prisma.technicianProfile.findUnique({
        where: { id: technicianId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                },
            },
            services: {
                include: {
                    category: true,
                    bookings: {
                        where: {
                            status: 'COMPLETED',
                        },
                        select: {
                            id: true,
                        },
                    },
                },
            },
            availability: {
                orderBy: {
                    day: 'asc',
                },
            },
            reviews: {
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: {
                    rating: 'desc',
                },
            },
            bookings: {
                where: {
                    status: 'COMPLETED',
                },
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    service: true,
                },
                orderBy: {
                    endAt: 'desc',
                },
                take: 10,
            },
        },
    });

    if (!technician) {
        throw new Error("Technician not found")
    }

    // Calculate stats
    const totalReviews = technician.reviews.length;
    const averageRating = totalReviews > 0
        ? technician.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    const totalCompletedJobs = technician.bookings.length;

    return {
        ...technician,
        averageRating,
        totalReviews,
        totalCompletedJobs,
    };
};

/**
 * Update technician profile (Private - Technician only)
 * PUT /api/technician/profile
 */
const updateTechnicianProfile = async (userId: string, payload: any) => {
    const { profilePhoto, bio, location, experience } = payload;

    // Check if technician exists
    const technician = await prisma.technicianProfile.findUnique({
        where: { userId },
    });

    if (!technician) {
        throw new Error("Technician not found")
    }

    // Update technician profile
    const updatedTechnician = await prisma.technicianProfile.update({
        where: { userId },
        data: {
            profilePhoto: profilePhoto || undefined,
            bio: bio || undefined,
            location: location || undefined,
            experience: experience !== undefined ? experience : undefined,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    isBan: true,
                },
            },
            availability: {
                orderBy: {
                    day: 'asc',
                },
            },
            services: {
                include: {
                    category: true,
                },
            },
        },
    });

    return updatedTechnician;
};

/**
 * Update availability slots (Private - Technician only)
 * PUT /api/technician/availability
 */
const updateAvailabilitySlots = async (userId: string, availabilities: any[]) => {
    // Check if technician exists
    const technician = await prisma.technicianProfile.findUnique({
        where: { userId },
    });

    if (!technician) {
        throw new Error("Technician not found");
    }

    // Delete existing availability slots
    await prisma.availability.deleteMany({
        where: { technicianId: technician.id },
    });

    // Create new availability slots
    const createdAvailabilities = await Promise.all(
        availabilities.map(async (avail) => {
            // Only create if the day is provided
            if (avail.day) {
                return prisma.availability.create({
                    data: {
                        day: avail.day,
                        startTime: avail.startTime || null,
                        endTime: avail.endTime || null,
                        isAvailable: avail.isAvailable !== undefined ? avail.isAvailable : true,
                        technicianId: technician.id,
                    },
                });
            }
            return null;
        })
    );

    // Filter out null values
    const filteredAvailabilities = createdAvailabilities.filter((a) => a !== null);

    // Return updated technician with availabilities
    const updatedTechnician = await prisma.technicianProfile.findUnique({
        where: { userId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                },
            },
            availability: {
                orderBy: {
                    day: 'asc',
                },
            },
            services: {
                include: {
                    category: true,
                },
            },
        },
    });

    return updatedTechnician;
};

/**
 * Get technician's own bookings (Private - Technician only)
 * GET /api/technician/bookings
 */
const getTechnicianOwnBookings = async (userId: string, status?: string, page: number = 1, limit: number = 10) => {
    // Get technician profile
    const technician = await prisma.technicianProfile.findUnique({
        where: { userId },
        select: { id: true },
    });

    if (!technician) {
        throw new Error("Technician not found");
    }

    const where: any = {
        technicianId: technician.id,
    };

    if (status) {
        where.status = status as BookingStatus;
    }

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
            where,
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        address: true,
                    },
                },
                service: {
                    include: {
                        category: true,
                    },
                },
                payment: {
                    select: {
                        id: true,
                        amount: true,
                        method: true,
                        status: true,
                        paidAt: true,
                        transactionId: true,
                    },
                },
                review: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                    },
                },
            },
            orderBy: { bookingDate: 'desc' },
            skip,
            take: limit,
        }),
        prisma.booking.count({ where }),
    ]);

    return {
        bookings,
        meta: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
};

/**
 * Update booking status (Accept/Decline/Complete/In Progress)
 * PATCH /api/technician/bookings/:id
 */
const updateBookingStatus = async (userId: string, bookingId: string, payload: any) => {
    const { status } = payload;

    // Get technician profile
    const technician = await prisma.technicianProfile.findUnique({
        where: { userId },
        select: { id: true },
    });

    if (!technician) {
        throw new Error("Technician not found");
    }

    // Get booking
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
            service: true,
            technician: true,
            payment: true,
        },
    });

    if (!booking) {
        throw new Error("Booking not found");
    }

    // Check if booking belongs to this technician
    if (booking.technicianId !== technician.id) {
        throw {
            statusCode: 403,
            message: "You are not authorized to update this booking",
            code: "UNAUTHORIZED_ACCESS",
        };
    }

    // Define allowed status transitions
    const allowedTransitions: Record<string, string[]> = {
        REQUESTED: ['ACCEPTED', 'DECLINED'],
        ACCEPTED: ['IN_PROGRESS'],
        PAID: ['IN_PROGRESS'],
        IN_PROGRESS: ['COMPLETED'],
        COMPLETED: [],
        DECLINED: [],
        CANCELLED: [],
    };

    // Check if transition is allowed
    if (!allowedTransitions[booking.status]?.includes(status)) {
        throw {
            statusCode: 400,
            message: `Cannot transition from ${booking.status} to ${status}`,
            code: "INVALID_STATUS_TRANSITION",
        };
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
            status: status as BookingStatus,
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
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
            service: {
                include: {
                    category: true,
                },
            },
            payment: true,
            review: true,
        },
    });

    // If booking is completed, update technician's rating
    if (status === 'COMPLETED') {
        // Get all completed bookings with reviews for this technician
        const completedBookings = await prisma.booking.findMany({
            where: {
                technicianId: technician.id,
                status: 'COMPLETED',
                review: {
                    isNot: null,
                },
            },
            include: {
                review: true,
            },
        });

        // Calculate average rating
        if (completedBookings.length > 0) {
            const totalRating = completedBookings.reduce(
                (sum, b) => sum + (b.review?.rating || 0),
                0
            );
            const averageRating = totalRating / completedBookings.length;

            await prisma.technicianProfile.update({
                where: { id: technician.id },
                data: {
                    rating: averageRating,
                },
            });
        }
    }

    return updatedBooking;
};

/**
 * Get technician dashboard stats (Private - Technician only)
 * GET /api/technician/dashboard
 */
const getTechnicianDashboard = async (userId: string) => {
    const technician = await prisma.technicianProfile.findUnique({
        where: { userId },
        select: { id: true },
    });

    if (!technician) {
        throw {
            statusCode: 404,
            message: "Technician profile not found",
            code: "TECHNICIAN_NOT_FOUND",
        };
    }

    const [
        totalBookings,
        pendingBookings,
        acceptedBookings,
        inProgressBookings,
        completedBookings,
        totalEarnings,
        upcomingBookings,
        recentReviews,
    ] = await Promise.all([
        // Total bookings
        prisma.booking.count({
            where: { technicianId: technician.id },
        }),
        // Pending bookings (REQUESTED)
        prisma.booking.count({
            where: {
                technicianId: technician.id,
                status: 'REQUESTED',
            },
        }),
        // Accepted bookings
        prisma.booking.count({
            where: {
                technicianId: technician.id,
                status: 'ACCEPTED',
            },
        }),
        // In progress bookings
        prisma.booking.count({
            where: {
                technicianId: technician.id,
                status: 'IN_PROGRESS',
            },
        }),
        // Completed bookings
        prisma.booking.count({
            where: {
                technicianId: technician.id,
                status: 'COMPLETED',
            },
        }),
        
        prisma.payment.aggregate({
            where: {
                status: "COMPLETED",
                booking: {
                    technicianId: technician.id,
                    status: "COMPLETED",
                },
            },
            _sum: {
                price: true,
            },
        }),

    prisma.booking.findMany({
        where: {
            technicianId: technician.id,
            status: { in: ['ACCEPTED', 'PAID'] },
            startAt: {
                gte: new Date(),
            },
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
            service: {
                select: {
                    id: true,
                    title: true,
                    price: true,
                },
            },
        },
        orderBy: { startAt: 'asc' },
        take: 5,
    }),
        // Recent reviews
        prisma.review.findMany({
            where: {
                technicianId: technician.id,
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                booking: {
                    select: {
                        service: {
                            select: {
                                title: true,
                            },
                        },
                    },
                },
            },
            orderBy: { rating: 'desc' },
            take: 5,
        }),
    ]);

return {
    stats: {
        totalBookings,
        pendingBookings,
        acceptedBookings,
        inProgressBookings,
        completedBookings,
        totalEarnings: totalEarnings._sum.price || 0,
        completionRate: totalBookings > 0
            ? Math.round((completedBookings / totalBookings) * 100)
            : 0,
    },
    upcomingBookings,
    recentReviews,
};
};

export const technicanService = {
    getAllTechniciansWithFilter,
    getTechnicianProfileWithReviews,
    updateTechnicianProfile,
    updateAvailabilitySlots,
    getTechnicianOwnBookings,
    updateBookingStatus,
    getTechnicianDashboard,
};