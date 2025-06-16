import { NextRequest } from 'next/server';

declare module 'next/server' {
    interface NextRequest {
        params: { [key: string]: string };
    }
} 