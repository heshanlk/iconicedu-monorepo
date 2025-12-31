import { redirect } from 'next/navigation';
import { DIRECT_MESSAGE_CHANNELS_WITH_MESSAGES } from '../../../../lib/data/channel-message-data';

export default function Page() {
  const firstChannel = DIRECT_MESSAGE_CHANNELS_WITH_MESSAGES[0];

  if (!firstChannel) {
    return null;
  }

  redirect(`/dashboard/dm/${firstChannel.id}`);
}
