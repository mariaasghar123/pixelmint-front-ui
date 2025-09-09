import { NextResponse } from "next/server";

export function middleware(request) {
    console.log("Middleware running on:", request.nextUrl.pathname);
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
