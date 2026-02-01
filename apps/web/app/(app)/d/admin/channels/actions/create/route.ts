import { NextResponse } from 'next/server';

import { createAdminChannel } from '@iconicedu/web/lib/admin/channel-create';

type CreateChannelRequest = {
  topic?: string;
  description?: string | null;
  purpose?: string | null;
  kind?: string | null;
};

export async function POST(request: Request) {
  const { topic, description, purpose, kind } =
    (await request.json()) as CreateChannelRequest;

  if (!topic?.trim()) {
    return NextResponse.json(
      { success: false, message: 'topic is required' },
      { status: 400 },
    );
  }

  try {
    const channelId = await createAdminChannel({
      topic: topic.trim(),
      description: description ?? null,
      purpose: purpose ?? null,
      kind: kind ?? null,
    });
    return NextResponse.json({ success: true, channelId });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
