import { NextResponse } from "next/server";

import { createUser, getUsers } from "@/services/user.service";

export async function GET() {
  try {
    const users = await getUsers();

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch users." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const user = await createUser(body.name, body.email);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to create user.",
      },
      { status: 400 },
    );
  }
}
