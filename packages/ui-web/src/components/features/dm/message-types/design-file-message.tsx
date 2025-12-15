import { memo } from 'react';
import { Figma, PenTool, Layers, ExternalLink } from 'lucide-react';
import { Button } from '../../../../ui/button';
import { Badge } from '../../../../ui/badge';
import type { DesignFileUpdateMessage } from '../../../../types/types';
import { MessageBase, type MessageBaseProps } from '../message-base';
import { cn } from '../../../../lib/utils';

interface DesignFileMessageProps extends Omit<MessageBaseProps, 'message' | 'children'> {
  message: DesignFileUpdateMessage;
}

const toolIcons = {
  figma: Figma,
  sketch: PenTool,
  'adobe-xd': Layers,
  canva: Layers,
  other: Layers,
};

const toolColors = {
  figma: 'bg-[#F24E1E]/10 text-[#F24E1E]',
  sketch: 'bg-[#F7B500]/10 text-[#F7B500]',
  'adobe-xd': 'bg-[#FF61F6]/10 text-[#FF61F6]',
  canva: 'bg-[#00C4CC]/10 text-[#00C4CC]',
  other: 'bg-primary/10 text-primary',
};

export const DesignFileMessage = memo(function DesignFileMessage(
  props: DesignFileMessageProps,
) {
  const { message, ...baseProps } = props;
  const ToolIcon = toolIcons[message.attachment.tool] || Layers;
  const toolColor = toolColors[message.attachment.tool] || toolColors.other;

  return (
    <MessageBase message={message} {...baseProps}>
      {message.content && (
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words mb-2">
          {message.content}
        </p>
      )}
      <div className="rounded-lg border border-border overflow-hidden max-w-md">
        {message.attachment.thumbnail && (
          <div className="aspect-video bg-muted relative">
            <img
              src={message.attachment.thumbnail || '/placeholder.svg'}
              alt={message.attachment.name}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-2 left-2 gap-1" variant="secondary">
              <ToolIcon className="h-3 w-3" />
              Design File
            </Badge>
          </div>
        )}
        <div className="p-3 bg-card">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded',
                toolColor,
              )}
            >
              <ToolIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {message.attachment.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground capitalize">
                  {message.attachment.tool}
                </span>
                {message.attachment.version && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      v{message.attachment.version}
                    </span>
                  </>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-1 bg-transparent">
              <ExternalLink className="h-3 w-3" />
              Open
            </Button>
          </div>
          {message.changesSummary && message.changesSummary.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Changes:</p>
              <ul className="space-y-1">
                {message.changesSummary.map((change, i) => (
                  <li
                    key={i}
                    className="text-xs text-foreground flex items-start gap-1.5"
                  >
                    <span className="text-primary mt-0.5">•</span>
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </MessageBase>
  );
});
