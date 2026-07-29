import { createUser, getUsers } from "@/services/user.service";

export async function GET() {
  const users = await getUsers();

  return Response.json(users);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const user = await createUser(body.name, body.email);

    return Response.json(user, {
      status: 201,
    });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 400,
      },
    );
  }
}
