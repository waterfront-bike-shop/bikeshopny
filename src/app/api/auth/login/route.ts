// app/api/auth/login/route.ts
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { signJWT } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();
    
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    console.log("Login attempt:", { identifier });
    console.log("User found:", user);

    if (!user || !(await argon2.verify(user.password, password))) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401 }
      );
    }

    if (!user.isAdmin) {
      return new NextResponse(
        JSON.stringify({ error: "Admin access only" }),
        { status: 403 }
      );
    }

    const token = signJWT({
      sub: user.id.toString(),
      email: user.email,
      isAdmin: user.isAdmin,
    });

    const cookieValue = `token=${token}; Path=/; HttpOnly; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }; Max-Age=86400`;

    const response = new NextResponse(
      JSON.stringify({ 
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
        }
      }), 
      {
        status: 200,
        headers: {
          "Set-Cookie": cookieValue,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
