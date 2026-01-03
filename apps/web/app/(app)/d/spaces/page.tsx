import { redirect } from 'next/navigation';
import { LEARNING_SPACE_CHANNELS_WITH_MESSAGES } from '../../../../lib/data/channel-message-data';

export default function Page() {
  const firstChannel = LEARNING_SPACE_CHANNELS_WITH_MESSAGES[0];

  if (!firstChannel) {
    return null;
  }

  redirect(`/d/spaces/${firstChannel.ids.id}`);
}
