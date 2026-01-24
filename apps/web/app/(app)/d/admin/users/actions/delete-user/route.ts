import { NextResponse } from 'next/server';

import { deleteUserAction } from '../../../auth/actions';

export async function POST(request: Request) {
  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json({ success: false, message: 'userId is required' }, { status: 400 });
  }
  const result = await deleteUserAction({ userId, softDelete: false });
  return NextResponse.json(result);
}
