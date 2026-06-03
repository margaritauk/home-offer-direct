import { NextRequest, NextResponse } from "next/server";
import { userStore } from "@/lib/user-store";

export async function POST(req: NextRequest) {
  try {
    const { name, email, passwordHash, tier = "free", state = "IL" } = await req.json();

    if (!name || !email || !passwordHash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const key = email.toLowerCase();
    if (userStore.has(key)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const user = {
      name,
      email: key,
      passwordHash,
      tier,
      state,
      createdAt: new Date().toISOString(),
    };
    userStore.set(key, user);

    // Return user without hash
    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json({ user: { ...safeUser, id: key, offers: [], savedHomes: [] } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
