import { getUserById, updateUser, deleteUser } from "@/services/user.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const user = await getUserById(Number(id));

  return Response.json(user);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  const user = await updateUser(Number(id), body.name, body.email, body.active);

  return Response.json(user);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await deleteUser(Number(id));

  return new Response(null, {
    status: 204,
  });
}
