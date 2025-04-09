import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const token = request.headers.get('cookie')?.split('token=')[1];

        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        const userId = decoded.userId;

        const trips = await prisma.trip.findMany({
            where: {
                NOT: {
                    userId,
                },
                status: 'pending',
                startTime: {
                    gt: new Date(),
                },
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                startTime: 'asc',
            },
        });

        return NextResponse.json(trips);
    } catch (error) {
        console.error('Error fetching available trips:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
} 