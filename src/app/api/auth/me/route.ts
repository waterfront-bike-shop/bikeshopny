// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Get the cookie from the request
    const cookieHeader = req.headers.get('cookie');
    console.log("Cookie header:", cookieHeader);
    
    if (!cookieHeader) {
      return new NextResponse(
        JSON.stringify({ error: "No authentication token" }),
        { status: 401 }
      );
    }

    // Extract the token from the cookie
    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    if (!tokenMatch) {
      return new NextResponse(
        JSON.stringify({ error: "No authentication token" }),
        { status: 401 }
      );
    }

    const token = tokenMatch[1];
    console.log("Token found:", token ? "✓" : "✗");

    // Verify the JWT
    const decoded = verifyJWT(token);
    console.log("JWT decoded:", decoded);

    if (!decoded) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401 }
      );
    }

    // Optionally fetch fresh user data from database
    const user = await prisma.user.findUnique({
      where: { id: parseInt(decoded.sub) },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isAdmin: true,
      }
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }),
        { status: 401 }
      );
    }

    return new NextResponse(
      JSON.stringify(user),
      { status: 200 }
    );

  } catch (error) {
    console.error("Auth me error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Authentication failed" }),
      { status: 401 }
    );
  }
}