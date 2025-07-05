// app/api/auth/login/route.ts
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { signJWT } from "@/lib/auth";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000", // adjust to your frontend port
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

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
        { status: 401, headers: corsHeaders }
      );
    }

    if (!user.isAdmin) {
      return new NextResponse(
        JSON.stringify({ error: "Admin access only" }),
        { status: 403, headers: corsHeaders }
      );
    }

    const token = signJWT({
      sub: user.id.toString(),
      email: user.email,
      isAdmin: user.isAdmin,
    });

    console.log("JWT token created:", token ? "✓" : "✗");

    // Create the cookie string
    const cookieValue = `token=${token}; Path=/; HttpOnly; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }; Max-Age=86400`;

    console.log("Setting cookie:", cookieValue);

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
          ...corsHeaders,
          "Set-Cookie": cookieValue,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
}