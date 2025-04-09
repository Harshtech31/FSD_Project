import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: Request) {
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

        const { startPoint, endPoint, startTime, seats, price } = await request.json();

        const trip = await prisma.trip.create({
            data: {
                userId,
                startPoint,
                endPoint,
                startTime: new Date(startTime),
                seats: parseInt(seats),
                price: parseFloat(price),
            },
        });

        return NextResponse.json(trip, { status: 201 });
    } catch (error) {
        console.error('Error creating trip:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
} 