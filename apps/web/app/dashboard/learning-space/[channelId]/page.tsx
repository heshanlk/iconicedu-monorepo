import { redirect } from 'next/navigation';

export default function Page({ params }: { params: { channelId: string } }) {
  redirect(`/dashboard/ls/${params.channelId}`);
}
