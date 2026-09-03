import { NextResponse } from "next/server";

import { getUserById, updateUser, deleteUser } from "@/services/user.service";
import { parseId } from "@/utils/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const userId = parseId(id);

    if (!userId) {
      return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
    }

    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch user." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const userId = parseId(id);

    if (!userId) {
      return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
    }

    const existingUser = await getUserById(userId);

    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const body = await request.json();

    const active = typeof body.active === "boolean" ? body.active : true;

    const user = await updateUser(userId, body.name, body.email, active);

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to update user.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const userId = parseId(id);

    if (!userId) {
      return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
    }

    const existingUser = await getUserById(userId);

    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    await deleteUser(userId);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete user." },
      { status: 500 },
    );
  }
}
