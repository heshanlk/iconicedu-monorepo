'use client';

import { memo, useMemo } from 'react';
import { FileText } from 'lucide-react';
import type {
  DesignFileUpdateMessageVM,
  FileMessageVM,
  ImageMessageVM,
  MessageVM,
} from '@iconicedu/shared-types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';

type MediaFilesPanelProps = {
  messages: MessageVM[];
  title?: string;
  filterUserId?: string;
};

const isImageMessage = (message: MessageVM): message is ImageMessageVM =>
  message.type === 'image';
const isFileMessage = (message: MessageVM): message is FileMessageVM =>
  message.type === 'file';
const isDesignFileMessage = (
  message: MessageVM,
): message is DesignFileUpdateMessageVM => message.type === 'design-file-update';

export const MediaFilesPanel = memo(function MediaFilesPanel({
  messages,
  title = 'Media & files',
  filterUserId,
}: MediaFilesPanelProps) {
  const scopedMessages = useMemo(() => {
    if (!filterUserId) return messages;
    return messages.filter((message) => message.sender.id === filterUserId);
  }, [filterUserId, messages]);

  const mediaItems = useMemo(
    () => scopedMessages.filter(isImageMessage),
    [scopedMessages],
  );
  const fileItems = useMemo(
    () =>
      scopedMessages.filter((message) => isFileMessage(message) || isDesignFileMessage(message)),
    [scopedMessages],
  );

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <Tabs defaultValue="media" className="min-w-0">
        <TabsList className="w-full justify-between">
          <TabsTrigger value="media" className="flex-1">
            Media
            <span className="text-xs text-muted-foreground">{mediaItems.length}</span>
          </TabsTrigger>
          <TabsTrigger value="files" className="flex-1">
            File
            <span className="text-xs text-muted-foreground">{fileItems.length}</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="media" className="min-w-0">
          {mediaItems.length === 0 ? (
            <p className="text-xs text-muted-foreground">No media yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {mediaItems.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="aspect-square overflow-hidden rounded-xl bg-muted"
                >
                  <img
                    src={item.attachment.url}
                    alt={item.attachment.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="files" className="min-w-0">
          {fileItems.length === 0 ? (
            <p className="text-xs text-muted-foreground">No files yet.</p>
          ) : (
            <div className="space-y-2">
              {fileItems.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-border p-2"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">
                      {item.type === 'design-file-update'
                        ? item.attachment.name
                        : item.attachment.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.type === 'design-file-update'
                        ? item.attachment.tool
                        : item.attachment.mimeType ?? 'File'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
});
