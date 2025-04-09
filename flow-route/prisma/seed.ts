import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Create test users
    const password = await bcrypt.hash('password123', 10);

    const user1 = await prisma.user.upsert({
        where: { email: 'test1@example.com' },
        update: {},
        create: {
            email: 'test1@example.com',
            password,
            name: 'Test User 1',
            profile: {
                create: {
                    bio: 'I love traveling!',
                    location: 'New York, NY',
                    rating: 4.5,
                },
            },
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'test2@example.com' },
        update: {},
        create: {
            email: 'test2@example.com',
            password,
            name: 'Test User 2',
            profile: {
                create: {
                    bio: 'Frequent traveler',
                    location: 'Los Angeles, CA',
                    rating: 4.8,
                },
            },
        },
    });

    // Create test trips
    const trip1 = await prisma.trip.create({
        data: {
            userId: user1.id,
            startPoint: 'New York, NY',
            endPoint: 'Boston, MA',
            startTime: new Date('2024-03-20T10:00:00Z'),
            seats: 3,
            price: 25.00,
            status: 'pending',
        },
    });

    const trip2 = await prisma.trip.create({
        data: {
            userId: user2.id,
            startPoint: 'Los Angeles, CA',
            endPoint: 'San Francisco, CA',
            startTime: new Date('2024-03-25T09:00:00Z'),
            seats: 2,
            price: 35.00,
            status: 'pending',
        },
    });

    console.log({ user1, user2, trip1, trip2 });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 