import { Badge } from '../../ui/badge';

export function EventLiveIndicator() {
  return (
    <Badge variant="destructive" className="absolute top-1.5 right-1.5 h-2 w-2 p-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex h-full w-full rounded-full bg-red-500" />
    </Badge>
  );
}
