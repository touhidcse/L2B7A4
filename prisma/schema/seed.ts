
import { prisma } from '../../src/lib/prisma';
import { PrismaClient, Role, DayOfWeek, BookingStatus, PaymentMethod, PaymentStatus } from "../../generated/prisma/client";
import bcrypt from 'bcryptjs';



// Configuration
const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = '1234546';
const ADMIN_EMAIL = 'admin2@fixitnow.com';
const ADMIN_PASSWORD = '1A2D3M4I5Nn@#6';

// Categories (8 categories)
const CATEGORIES = [
    'Carpentry',
    'Gardening',
    'HVAC',
    'Pest Control',
    'Security System Installation',
    'Interior Design',
    'Home Maintenance',
    'Furniture Repair'
];

// Bangladeshi Customer Names
const CUSTOMER_NAMES = [
    'Md. Rahman', 'Sadia Akhter', 'Kamal Hossain', 'Nasrin Begum', 'Rafiqul Islam',
    'Taslima Akhter', 'Shahidul Alam', 'Momena Khatun', 'Jahangir Alam', 'Shirin Sultana',
    'Abdul Halim', 'Rokeya Begum', 'Mizanur Rahman', 'Farida Akhter', 'Habibur Rahman',
    'Salma Akhter', 'Sirajul Islam', 'Amina Begum', 'Mokhlesur Rahman', 'Tahmina Akhter'
];

// Bangladeshi Customer Addresses (Dhaka)
const CUSTOMER_ADDRESSES = [
    'House #45, Road #12, Block-A, Mirpur-12, Dhaka-1216',
    'Flat #3B, House #78, Road #5, Dhanmondi R/A, Dhaka-1205',
    'House #23, Road #9, Sector-4, Uttara, Dhaka-1230',
    'Apartment #6A, House #56, Road #2, Banani, Dhaka-1213',
    'House #89, Road #15, Block-C, Mohammadpur, Dhaka-1207',
    'Flat #4C, House #34, Road #8, Gulshan-1, Dhaka-1212',
    'House #67, Road #3, Sector-7, Uttara, Dhaka-1230',
    'Apartment #2B, House #90, Road #11, Dhanmondi R/A, Dhaka-1205',
    'House #12, Road #6, Block-B, Mirpur-2, Dhaka-1216',
    'Flat #5D, House #45, Road #4, Banani, Dhaka-1213',
    'House #78, Road #14, Sector-10, Uttara, Dhaka-1230',
    'Apartment #3A, House #23, Road #7, Gulshan-2, Dhaka-1212',
    'House #56, Road #1, Block-D, Mohammadpur, Dhaka-1207',
    'Flat #6B, House #67, Road #10, Dhanmondi R/A, Dhaka-1205',
    'House #34, Road #13, Sector-3, Uttara, Dhaka-1230',
    'Apartment #1C, House #89, Road #9, Banani, Dhaka-1213',
    'House #90, Road #16, Block-E, Mirpur-11, Dhaka-1216',
    'Flat #7A, House #56, Road #3, Gulshan-1, Dhaka-1212',
    'House #23, Road #17, Sector-5, Uttara, Dhaka-1230',
    'Apartment #8B, House #78, Road #12, Dhanmondi R/A, Dhaka-1205'
];

// Bangladeshi Technician Names
const TECHNICIAN_NAMES = [
    // Carpentry
    'Md. Kamal Uddin', 'Abdur Rahim',
    // HVAC
    'Md. Jalal Uddin', 'Abdul Mannan',
    // Gardening
    'Md. Shafiqul Islam', 'Abul Kalam',
    // Pest Control
    'Md. Abdur Razzak', 'Md. Anwar Hossain',
    // Security System Installation
    'Md. Shahidul Islam', 'Md. Mizanur Rahman',
    // Interior Design
    'Sadia Rahman', 'Nadia Akhter',
    // Home Maintenance
    'Md. Jahangir Alam', 'Md. Motaleb Hossain',
    // Furniture Repair
    'Md. Rashidul Islam', 'Md. Abdul Latif'
];

// Bangladeshi Technician Locations
const TECHNICIAN_LOCATIONS = [
    'Mirpur, Dhaka', 'Dhanmondi, Dhaka', 'Uttara, Dhaka', 'Banani, Dhaka',
    'Mohammadpur, Dhaka', 'Gulshan, Dhaka', 'Motijheel, Dhaka', 'Farmgate, Dhaka',
    'Chittagong City', 'Rajshahi City', 'Khulna City', 'Sylhet City',
    'Barishal City', 'Rangpur City', 'Mymensingh City', 'Comilla City',
    'Savar, Dhaka', 'Narayanganj, Dhaka', 'Gazipur, Dhaka', 'Keraniganj, Dhaka'
];

// Technician data with category mapping
const TECHNICIAN_DATA = [
    { name: TECHNICIAN_NAMES[0] || 'Technician 1', category: 'Carpentry', experience: 8, rate: 45, location: TECHNICIAN_LOCATIONS[0] || 'Dhaka' },
    { name: TECHNICIAN_NAMES[1] || 'Technician 2', category: 'Carpentry', experience: 6, rate: 50, location: TECHNICIAN_LOCATIONS[1] || 'Dhaka' },
    { name: TECHNICIAN_NAMES[2] || 'Technician 3', category: 'HVAC', experience: 10, rate: 55, location: TECHNICIAN_LOCATIONS[2] || 'Dhaka' },
    { name: TECHNICIAN_NAMES[3] || 'Technician 4', category: 'HVAC', experience: 7, rate: 60, location: TECHNICIAN_LOCATIONS[3] || 'Dhaka' },
    { name: TECHNICIAN_NAMES[4] || 'Technician 5', category: 'Gardening', experience: 5, rate: 35, location: TECHNICIAN_LOCATIONS[4] || 'Dhaka' },
    { name: TECHNICIAN_NAMES[5] || 'Technician 6', category: 'Gardening', experience: 4, rate: 30, location: TECHNICIAN_LOCATIONS[5] || 'Dhaka' },
    { name: TECHNICIAN_NAMES[6] || 'Technician 7', category: 'Pest Control', experience: 9, rate: 40, location: TECHNICIAN_LOCATIONS[6] || 'Dhaka' },
    { name: TECHNICIAN_NAMES[7] || 'Technician 8', category: 'Pest Control', experience: 6, rate: 45, location: TECHNICIAN_LOCATIONS[7] || 'Dhaka' },
    { name: TECHNICIAN_NAMES[8] || 'Technician 9', category: 'Security System Installation', experience: 8, rate: 65, location: TECHNICIAN_LOCATIONS[8] || 'Dhaka' },
    { name: TECHNICIAN_NAMES[9] || 'Technician 10', category: 'Security System Installation', experience: 7, rate: 70, location: TECHNICIAN_LOCATIONS[9] || 'Dhaka' },
    { name: TECHNICIAN_NAMES[10] || 'Technician 11', category: 'Interior Design', experience: 8, rate: 75, location: TECHNICIAN_LOCATIONS[10] || 'Dhaka' },
    { name: TECHNICIAN_NAMES[11] || 'Technician 12', category: 'Interior Design', experience: 5, rate: 65, location: TECHNICIAN_LOCATIONS[11] || 'Dhaka' },
    { name: TECHNICIAN_NAMES[12] || 'Technician 13', category: 'Home Maintenance', experience: 10, rate: 40, location: TECHNICIAN_LOCATIONS[12] || 'Dhaka' },
    { name: TECHNICIAN_NAMES[13] || 'Technician 14', category: 'Home Maintenance', experience: 6, rate: 50, location: TECHNICIAN_LOCATIONS[13] || 'Dhaka' },
    { name: TECHNICIAN_NAMES[14] || 'Technician 15', category: 'Furniture Repair', experience: 7, rate: 45, location: TECHNICIAN_LOCATIONS[14] || 'Dhaka' },
    { name: TECHNICIAN_NAMES[15] || 'Technician 16', category: 'Furniture Repair', experience: 4, rate: 40, location: TECHNICIAN_LOCATIONS[15] || 'Dhaka' }
];

// Service data per category (Bangladeshi context)
const SERVICE_TITLES: Record<string, string[]> = {
    'Carpentry': [
        'Custom Furniture Making',
        'Cabinet Installation',
        'Woodworking & Repair',
        'Door & Window Installation'
    ],
    'HVAC': [
        'AC Installation & Repair',
        'Heating System Repair',
        'Ventilation Cleaning',
        'Thermostat Setup'
    ],
    'Gardening': [
        'Garden Design & Landscaping',
        'Lawn Maintenance',
        'Tree Trimming & Pruning',
        'Irrigation System Installation'
    ],
    'Pest Control': [
        'General Pest Control',
        'Termite Treatment',
        'Rodent Control',
        'Bed Bug Removal'
    ],
    'Security System Installation': [
        'CCTV Installation',
        'Alarm System Setup',
        'Access Control Systems',
        'Smart Home Security'
    ],
    'Interior Design': [
        'Space Planning & Design',
        'Color Consultation',
        'Furniture Selection',
        'Lighting Design'
    ],
    'Home Maintenance': [
        'General Home Repair',
        'Handyman Service',
        'Furniture Assembly',
        'Home Maintenance Check'
    ],
    'Furniture Repair': [
        'Wood Refinishing',
        'Upholstery Repair',
        'Furniture Restoration',
        'Furniture Assembly & Repair'
    ]
};

// Availability slots
const AVAILABILITY_SLOTS = [
    { day: DayOfWeek.SATURDAY, start: '09:00', end: '17:00' },
    { day: DayOfWeek.SUNDAY, start: '09:00', end: '17:00' },
    { day: DayOfWeek.MONDAY, start: '09:00', end: '17:00' },
    { day: DayOfWeek.TUESDAY, start: '09:00', end: '17:00' },
    { day: DayOfWeek.WEDNESDAY, start: '09:00', end: '17:00' },
    { day: DayOfWeek.THURSDAY, start: '09:00', end: '17:00' },
];

// Bangladeshi phone number generator
const generateBDPhone = (): string => {
    const prefixes = ['017', '018', '019', '016', '013', '014'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.random().toString().slice(2, 11);
    return `${prefix}${number}`;
};

// Helper function to generate random number between min and max
const randomBetween = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to pick random item from array
const randomPick = <T>(arr: T[]): T => {
    if (!arr || arr.length === 0) {
        throw new Error('Cannot pick from empty array');
    }
    return arr[Math.floor(Math.random() * arr.length)]!;
};

// Helper function to generate random date
const randomDate = (daysFromNow: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + randomBetween(1, daysFromNow));
    date.setHours(randomBetween(8, 17), randomBetween(0, 59), 0, 0);
    return date;
};

// Helper function to generate random customer name and address
const generateCustomerData = (index: number) => {
    const nameIndex = index % CUSTOMER_NAMES.length;
    const addressIndex = index % CUSTOMER_ADDRESSES.length;
    return {
        name: CUSTOMER_NAMES[nameIndex] || 'Customer',
        address: CUSTOMER_ADDRESSES[addressIndex] || 'Dhaka, Bangladesh',
        phone: generateBDPhone()
    };
};

async function main() {
    console.log('🌱 Starting seed with Bangladeshi data...');

    // 1. Hash password
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
    const adminHashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

    // 2. Create Admin
    const admin = await prisma.user.upsert({
        where: { email: ADMIN_EMAIL },
        update: {
            password: adminHashedPassword,
            name: 'System Admin',
            role: Role.ADMIN,
            isBan: false,
            phone: '01700000000',
            address: 'House #01, Road #01, Dhanmondi R/A, Dhaka-1205',
        },
        create: {
            email: ADMIN_EMAIL,
            password: adminHashedPassword,
            name: 'System Admin',
            role: Role.ADMIN,
            isBan: false,
            phone: '01700000000',
            address: 'House #01, Road #01, Dhanmondi R/A, Dhaka-1205',
        },
    });
    console.log(`✅ Admin created/updated: ${admin.email}`);

    // 3. Create Categories (only new ones that don't exist)
    const createdCategories: any[] = [];
    for (const categoryType of CATEGORIES) {
        const category = await prisma.category.upsert({
            where: { type: categoryType },
            update: {},
            create: {
                type: categoryType,
            },
        });
        createdCategories.push(category);
        console.log(`✅ Category created/updated: ${category.type}`);
    }

    // Create category map for easy lookup
    const categoryMap = Object.fromEntries(
        createdCategories.map(c => [c.type, c.id])
    );

    // 4. Create Customers (10 customers with Bangladeshi data)
    const customers: any[] = [];
    for (let i = 15; i <= 24; i++) {
        const customerData = generateCustomerData(i - 15);
        const customer = await prisma.user.upsert({
            where: { email: `level${i}@programminghero.com` },
            update: {
                name: customerData.name,
                phone: customerData.phone,
                address: customerData.address,
                isBan: false,
            },
            create: {
                email: `level${i}@programminghero.com`,
                password: hashedPassword,
                name: customerData.name,
                role: Role.CUSTOMER,
                phone: customerData.phone,
                address: customerData.address,
                isBan: false,
            },
        });
        customers.push(customer);
        console.log(`✅ Customer created/updated: ${customer.email} - ${customerData.name}`);
    }

    // 5. Create Technicians with profiles, services, and availability
    const technicians: any[] = [];
    let techCounter = 0;

    for (const techData of TECHNICIAN_DATA) {
        const categoryId = categoryMap[techData.category];
        if (!categoryId) {
            console.log(`⚠️ Category ${techData.category} not found, skipping...`);
            continue;
        }

        // Create email from name
        const name = techData.name || 'Technician';
        const emailName = name.toLowerCase().replace(/\s+/g, '.');
        const email = `${emailName}@fixitnow.com`;

        // Create user with technician profile
        const user = await prisma.user.upsert({
            where: { email: email },
            update: {
                name: name,
                phone: generateBDPhone(),
                address: techData.location || 'Dhaka',
                isBan: false,
                technicianProfile: {
                    upsert: {
                        update: {
                            bio: `Professional ${techData.category} specialist with ${techData.experience} years of experience in Bangladesh.`,
                            experience: techData.experience,
                            location: techData.location || 'Dhaka',
                            profilePhoto: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&size=200`,
                        },
                        create: {
                            bio: `Professional ${techData.category} specialist with ${techData.experience} years of experience in Bangladesh.`,
                            experience: techData.experience,
                            location: techData.location || 'Dhaka',
                            profilePhoto: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&size=200`,
                            availability: {
                                create: AVAILABILITY_SLOTS.map(slot => ({
                                    day: slot.day,
                                    startTime: slot.start,
                                    endTime: slot.end,
                                    isAvailable: true,
                                })),
                            },
                        },
                    },
                },
            },
            create: {
                email: email,
                password: hashedPassword,
                name: name,
                role: Role.TECHNICIAN,
                phone: generateBDPhone(),
                address: techData.location || 'Dhaka',
                isBan: false,
                technicianProfile: {
                    create: {
                        bio: `Professional ${techData.category} specialist with ${techData.experience} years of experience in Bangladesh.`,
                        experience: techData.experience,
                        location: techData.location || 'Dhaka',
                        profilePhoto: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&size=200`,
                        availability: {
                            create: AVAILABILITY_SLOTS.map(slot => ({
                                day: slot.day,
                                startTime: slot.start,
                                endTime: slot.end,
                                isAvailable: true,
                            })),
                        },
                    },
                },
            },
            include: {
                technicianProfile: {
                    include: {
                        availability: true,
                    },
                },
            },
        });

        if (!user.technicianProfile) {
            console.log(`⚠️ Failed to create technician profile for ${name}`);
            continue;
        }

        technicians.push(user);
        techCounter++;

        // Create services for technician
        const serviceTitles = SERVICE_TITLES[techData.category] || ['General Service'];
        const services: any[] = [];

        for (let i = 0; i < Math.min(serviceTitles.length, 4); i++) {
            const basePrice = techData.rate * (1 + (i * 0.3));
            const priceInBDT = Math.round((basePrice * 120) / 10) * 10;
            
            const service = await prisma.service.upsert({
                where: {
                    // Use a composite key or find by unique combination
                    // Since there's no unique constraint, we'll use a custom approach
                    id: `${user.technicianProfile.id}-${serviceTitles[i]!.replace(/\s+/g, '-')}` as any,
                },
                update: {
                    title: serviceTitles[i],
                    description: `Professional ${serviceTitles[i]!.toLowerCase()} service by ${name}. Quality guaranteed!`,
                    price: priceInBDT,
                    categoryId: categoryId,
                    technicianId: user.technicianProfile.id,
                },
                create: {
                    title: serviceTitles[i]!,
                    description: `Professional ${serviceTitles[i]!.toLowerCase()} service by ${name}. Quality guaranteed!`,
                    price: priceInBDT,
                    categoryId: categoryId,
                    technicianId: user.technicianProfile.id,
                },
            });
            services.push(service);
        }

        console.log(`✅ Technician created/updated: ${name} (${techData.category}) with ${services.length} services`);
    }

    // 6. Create Bookings, Payments, and Reviews
    const statuses = ['REQUESTED', 'DECLINED', 'ACCEPTED', 'PAID', 'CANCELLED', 'IN_PROGRESS', 'COMPLETED'];
    const completedStatuses = ['COMPLETED'];
    const payableStatuses = ['ACCEPTED'];

    let bookingCounter = 0;

    for (let i = 0; i < customers.length; i++) {
        const customer = customers[i];

        // Each customer gets 4 bookings
        for (let b = 0; b < 4; b++) {
            // Pick random technician
            const technician = randomPick(technicians);
            if (!technician || !technician.technicianProfile) continue;

            // Pick random service from technician's services
            const technicianServices = await prisma.service.findMany({
                where: { technicianId: technician.technicianProfile.id },
            });

            if (technicianServices.length === 0) continue;

            const service = randomPick(technicianServices);
            const status = randomPick(statuses);
            const isCompleted = completedStatuses.includes(status);
            const isPayable = payableStatuses.includes(status);

            const startDate = randomDate(30);
            const endDate = new Date(startDate);
            endDate.setHours(endDate.getHours() + randomBetween(1, 3));

            // Create booking
            const booking = await prisma.booking.create({
                data: {
                    customerId: customer.id,
                    technicianId: technician.technicianProfile.id,
                    serviceId: service.id,
                    price: service.price,
                    status: status as BookingStatus,
                    bookingDate: startDate,
                    startAt: startDate,
                    endAt: endDate,
                    cancelAt: status === 'CANCELLED' ? new Date(startDate.getTime() - 86400000) : undefined,
                    cancelReason: status === 'CANCELLED' ? 'Customer changed mind' : undefined,
                },
            });

            bookingCounter++;

            // Create payment only for ACCEPTED bookings
            if (isPayable) {
                const existingPayment = await prisma.payment.findUnique({
                    where: { bookingId: booking.id }
                });

                if (!existingPayment) {
                    const payment = await prisma.payment.create({
                        data: {
                            bookingId: booking.id,
                            customerId: customer.id,
                            price: service.price,
                            method: PaymentMethod.STRIPE,
                            stripeCustomerId: `cus_${Math.random().toString(36).substring(2, 15)}`,
                            stripePaymentId: `pi_${Math.random().toString(36).substring(2, 15)}`,
                            status: PaymentStatus.PENDING,
                            paidAt: undefined,
                        },
                    });
                    console.log(`💰 Payment created for booking: ${booking.id} (Status: ${status})`);
                }
            }

            // Create review only for completed bookings
            if (isCompleted) {
                const reviewComments = [
                    'Excellent service! Highly recommend!',
                    'Very professional and punctual!',
                    'Great work, very satisfied!',
                    'Will hire again for sure!',
                    'Fantastic job, exceeded expectations!',
                    'Very reliable and skilled professional!',
                    'Perfect service, thank you!',
                    'Amazing quality of work!'
                ];
                
                const review = await prisma.review.create({
                    data: {
                        bookingId: booking.id,
                        customerId: customer.id,
                        technicianId: technician.technicianProfile.id,
                        rating: randomBetween(3, 5),
                        comment: randomPick(reviewComments),
                        reviewDate: new Date(),
                    },
                });
                console.log(`⭐ Review created for booking: ${booking.id}`);

                // Update technician rating
                const allReviews = await prisma.review.findMany({
                    where: { technicianId: technician.technicianProfile.id },
                    select: { rating: true },
                });

                if (allReviews.length > 0) {
                    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
                    await prisma.technicianProfile.update({
                        where: { id: technician.technicianProfile.id },
                        data: { rating: Math.round(avgRating * 10) / 10 },
                    });
                }
            }

            console.log(`📅 Booking ${bookingCounter} created: ${booking.id} (Status: ${status})`);
        }
    }

    // 7. Display Summary
    const totalUsers = await prisma.user.count();
    const totalTechnicians = await prisma.user.count({ where: { role: Role.TECHNICIAN } });
    const totalCustomers = await prisma.user.count({ where: { role: Role.CUSTOMER } });
    const totalBookings = await prisma.booking.count();
    const totalPayments = await prisma.payment.count();
    const totalReviews = await prisma.review.count();
    const totalServices = await prisma.service.count();

    console.log('\n📊 Seed Summary:');
    console.log(`✅ Users: ${totalUsers} (${totalCustomers} Customers, ${totalTechnicians} Technicians, 1 Admin)`);
    console.log(`✅ Categories: ${createdCategories.length}`);
    console.log(`✅ Services: ${totalServices}`);
    console.log(`✅ Bookings: ${totalBookings}`);
    console.log(`✅ Payments: ${totalPayments}`);
    console.log(`✅ Reviews: ${totalReviews}`);
    console.log('\n🌱 Seed completed successfully!');

    // 8. Print login credentials
    console.log('\n🔑 Login Credentials:');
    console.log(`Admin: ${ADMIN_EMAIL} | Password: ${ADMIN_PASSWORD}`);
    console.log(`Customer: level15@programminghero.com - level24@programminghero.com | Password: ${DEFAULT_PASSWORD}`);
    console.log(`Technicians: (Check emails in database) | Password: ${DEFAULT_PASSWORD}`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });