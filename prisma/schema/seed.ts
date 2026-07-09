
import { PrismaClient, Role, BookingStatus, PaymentMethod, PaymentStatus } from "../../generated/prisma/client"
import bcrypt from 'bcryptjs';
import config from '../../src/config';
import { prisma } from '../../src/lib/prisma';



async function main() {
    // Create admin user
    const adminPassword = await bcrypt.hash(config.admin_password, 12);
    const admin = await prisma.user.upsert({
        where: { email: config.admin_email },
        update: {},
        create: {
            email: config.admin_email,
            password: adminPassword,
            name: 'System Admin',
            role: Role.ADMIN,
            isActive: true,
        },
    });
    console.log(`Admin created: ${admin.email}`);

    // Create categories
    const categories = [
        { name: 'Plumbing', description: 'Plumbing services including pipe repair, installation, and maintenance' },
        { name: 'Electrical', description: 'Electrical services including wiring, installation, and repair' },
        { name: 'Cleaning', description: 'Professional cleaning services for homes and offices' },
        { name: 'Painting', description: 'Interior and exterior painting services' },
        { name: 'Carpentry', description: 'Carpentry and woodwork services' },
        { name: 'Gardening', description: 'Gardening and landscaping services' },
        { name: 'HVAC', description: 'Heating, ventilation, and air conditioning services' },
        { name: 'Pest Control', description: 'Professional pest control and extermination services' },
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: category,
        });
    }
    console.log(` ${categories.length} categories created`);

    // Get all categories for service creation
    const allCategories = await prisma.category.findMany();

    if (!allCategories || allCategories.length === 0) {
        throw new Error('No categories found in the database');
    }

    const categoryMap = Object.fromEntries(
        allCategories.map((c) => [c.name, c.id])
    );

    // Create sample technicians
    const techPassword = await bcrypt.hash('Password123', 12);

    const technicianData = [
        {
            email: 'john.doe@example.com',
            name: 'John Doe',
            phone: '+1234567890',
            address: '123 Main St, City, State',
            skills: ['Plumbing', 'Pipe Repair', 'Installation'],
            experienceYears: 5,
            hourlyRate: 45,
            bio: 'Experienced plumber with 5+ years in residential and commercial plumbing',
            category: 'Plumbing',
            description: 'Professional plumbing services including repairs, installations, and maintenance',
            location: 'New York, NY',
            availability: {
                monday: ['09:00-12:00', '13:00-17:00'],
                tuesday: ['09:00-12:00', '13:00-17:00'],
                wednesday: ['09:00-12:00', '13:00-17:00'],
                thursday: ['09:00-12:00', '13:00-17:00'],
                friday: ['09:00-12:00', '13:00-17:00'],
                saturday: ['09:00-13:00'],
                sunday: []
            }
        },
        {
            email: 'jane.smith@example.com',
            name: 'Jane Smith',
            phone: '+1234567891',
            address: '456 Oak Ave, City, State',
            skills: ['Electrical', 'Wiring', 'Installation'],
            experienceYears: 7,
            hourlyRate: 50,
            bio: 'Licensed electrician specializing in home wiring and electrical installations',
            category: 'Electrical',
            description: 'Professional electrical services including wiring, installations, and repairs',
            location: 'Los Angeles, CA',
            availability: {
                monday: ['09:00-12:00', '13:00-17:00'],
                tuesday: ['09:00-12:00', '13:00-17:00'],
                wednesday: ['09:00-12:00', '13:00-17:00'],
                thursday: ['09:00-12:00', '13:00-17:00'],
                friday: ['09:00-12:00', '13:00-17:00'],
                saturday: ['09:00-13:00'],
                sunday: []
            }
        },
        {
            email: 'bob.johnson@example.com',
            name: 'Bob Johnson',
            phone: '+1234567892',
            address: '789 Pine St, City, State',
            skills: ['Painting', 'Drywall', 'Decorative Finishing'],
            experienceYears: 3,
            hourlyRate: 35,
            bio: 'Professional painter with expertise in interior and exterior painting',
            category: 'Painting',
            description: 'Professional painting services for interior and exterior surfaces',
            location: 'Chicago, IL',
            availability: {
                monday: ['09:00-12:00', '13:00-17:00'],
                tuesday: ['09:00-12:00', '13:00-17:00'],
                wednesday: ['09:00-12:00', '13:00-17:00'],
                thursday: ['09:00-12:00', '13:00-17:00'],
                friday: ['09:00-12:00', '13:00-17:00'],
                saturday: ['09:00-13:00'],
                sunday: []
            }
        },
    ];

    const createdTechnicians = [];

    for (const tech of technicianData) {
        // Create user with technician profile
        const user = await prisma.user.create({
            data: {
                email: tech.email,
                password: techPassword,
                name: tech.name,
                phone: tech.phone,
                address: tech.address,
                role: Role.TECHNICIAN,
                isActive: true,
                technicianProfile: {
                    create: {
                        skills: tech.skills,
                        experienceYears: tech.experienceYears,
                        hourlyRate: tech.hourlyRate,
                        bio: tech.bio,
                        category: tech.category,
                        description: tech.description,
                        location: tech.location,
                        isAvailable: true,
                        availability: tech.availability,
                    },
                },
            },
            include: {
                technicianProfile: true,
            },
        });

        if (!user.technicianProfile) {
            throw new Error(`Failed to create technician profile for ${tech.name}`);
        }

        createdTechnicians.push(user);

        // Create services for technician
        const primarySkill = tech.skills?.[0] ?? 'General';
        const categoryId = categoryMap[primarySkill] || allCategories[0]!.id;
        const hourlyRate = tech.hourlyRate ?? 50;

        const services = [
            {
                title: `Full ${primarySkill} Service`,
                description: `Comprehensive ${primarySkill.toLowerCase()} service for your home`,
                categoryId: categoryId,
                price: hourlyRate * 2,
                duration: 120,
                technicianId: user.technicianProfile.id,
                isActive: true,
            },
            {
                title: `${primarySkill} Repair`,
                description: `Quick and efficient ${primarySkill.toLowerCase()} repair service`,
                categoryId: categoryId,
                price: hourlyRate * 1.5,
                duration: 60,
                technicianId: user.technicianProfile.id,
                isActive: true,
            },
            {
                title: `${primarySkill} Maintenance`,
                description: `Regular ${primarySkill.toLowerCase()} maintenance service to keep everything running smoothly`,
                categoryId: categoryId,
                price: hourlyRate * 1.2,
                duration: 90,
                technicianId: user.technicianProfile.id,
                isActive: true,
            },
        ];

        for (const service of services) {
            await prisma.service.create({
                data: service,
            });
        }
        console.log(`Technician created: ${tech.name} with ${services.length} services`);
    }

    // Create sample customer
    const customerPassword = await bcrypt.hash('Customer123', 12);
    const customer = await prisma.user.upsert({
        where: { email: 'customer@example.com' },
        update: {},
        create: {
            email: 'customer@example.com',
            password: customerPassword,
            name: 'Test Customer',
            phone: '+1234567899',
            address: '456 Customer Ave, City, State',
            role: Role.CUSTOMER,
            isActive: true,
        },
    });
    console.log(`Customer created: ${customer.email}`);

    // Create sample bookings
    if (createdTechnicians.length > 0) {
        const technician1 = createdTechnicians[0];
        const technician1Profile = technician1!.technicianProfile;

        // Get services for this technician
        const technicianServices = await prisma.service.findMany({
            where: { technicianId: technician1Profile!.id },
            take: 2,
        });

        if (technicianServices.length > 0) {
            // Create a booking
            const bookingNumber = `BK-${Date.now()}`;
            const booking = await prisma.booking.create({
                data: {
                    bookingNumber: bookingNumber,
                    customerId: customer.id,
                    technicianId: technician1Profile!.id,
                    serviceId: technicianServices[0]!.id,
                    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                    scheduledTime: '10:00',
                    location: customer.address || 'Customer Location',
                    address: customer.address,
                    notes: 'Please bring all necessary tools',
                    status: BookingStatus.REQUESTED,
                    totalAmount: technicianServices[0]!.price,
                    discountApplied: 0,
                    finalAmount: technicianServices[0]!.price,
                    isPaid: false,
                },
            });
            console.log(`Booking created: ${booking.bookingNumber}`);

            // Create a payment for the booking
            const payment = await prisma.payment.create({
                data: {
                    bookingId: booking.id,
                    userId: customer.id,
                    amount: booking.finalAmount,
                    currency: 'usd',
                    method: PaymentMethod.STRIPE,
                    provider: 'stripe',
                    transactionId: `txn_${Date.now()}`,
                    paymentIntentId: `pi_${Date.now()}`,
                    status: PaymentStatus.PENDING,
                    stripeSessionId: `session_${Date.now()}`,
                },
            });
            console.log(`Payment created: ${payment.id}`);

            // Create a review for the booking
            const review = await prisma.review.create({
                data: {
                    bookingId: booking.id,
                    customerId: customer.id,
                    technicianId: technician1Profile!.id,
                    rating: 5,
                    comment: 'Excellent service! Very professional and thorough.',
                    images: [],
                    isVerified: true,
                },
            });
            console.log(`Review created: ${review.id}`);

            // Update technician rating
            await prisma.technicianProfile.update({
                where: { id: technician1Profile!.id },
                data: {
                    rating: 5.0,
                    totalReviews: 1,
                },
            });
            console.log(`Technician rating updated`);
        }
    }

    // Create a second booking with different status
    if (createdTechnicians.length > 1) {
        const technician2 = createdTechnicians[1];
        const technician2Profile = technician2!.technicianProfile;

        const technicianServices = await prisma.service.findMany({
            where: { technicianId: technician2Profile!.id },
            take: 1,
        });

        if (technicianServices.length > 0) {
            const bookingNumber = `BK-${Date.now() + 1000}`;
            const booking = await prisma.booking.create({
                data: {
                    bookingNumber: bookingNumber,
                    customerId: customer.id,
                    technicianId: technician2Profile!.id,
                    serviceId: technicianServices[0]!.id,
                    scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
                    scheduledTime: '14:00',
                    location: customer.address || 'Customer Location',
                    address: customer.address,
                    notes: 'Please call before arriving',
                    status: BookingStatus.REQUESTED,
                    totalAmount: technicianServices[0]!.price,
                    discountApplied: 10,
                    finalAmount: technicianServices[0]!.price * 0.9,
                    isPaid: false,
                },
            });
            console.log(`Second booking created: ${booking.bookingNumber}`);
        }
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });