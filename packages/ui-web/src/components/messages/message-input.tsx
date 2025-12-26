'use client';

import { useState, useRef, useCallback, memo, type KeyboardEvent } from 'react';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { EmojiPicker } from './emoji-picker';
import {
  Bold,
  Italic,
  Link2,
  AtSign,
  Smile,
  Paperclip,
  Send,
  Mic,
  ImageIcon,
} from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string) => void;
  placeholder?: string;
}

const FormatButton = memo(function FormatButton({
  icon: Icon,
  label,
}: {
  icon: any;
  label: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
});

export const MessageInput = memo(function MessageInput({
  onSend,
  placeholder = 'Write a message...',
}: MessageInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    if (content.trim()) {
      onSend(content.trim());
      setContent('');
      textareaRef.current?.focus();
    }
  }, [content, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.slice(0, start) + emoji + content.slice(end);

      setContent(newContent);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    },
    [content],
  );

  const formatButtons = [
    { icon: Bold, label: 'Bold' },
    { icon: Italic, label: 'Italic' },
    { icon: Link2, label: 'Link' },
  ];

  return (
    <div className="border-t border-border bg-card p-4 rounded-xl">
      <div className="rounded-xl border border-input bg-background focus-within:ring-1 focus-within:ring-ring">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[80px] resize-none border-0 bg-transparent px-3 py-2 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <div className="flex items-center justify-between border-t border-border px-2 py-1.5">
          <TooltipProvider>
            <div className="flex items-center gap-0.5">
              {formatButtons.map((btn) => (
                <FormatButton key={btn.label} icon={btn.icon} label={btn.label} />
              ))}
              <div className="mx-1 h-4 w-px bg-border" />
              <FormatButton icon={AtSign} label="Mention someone" />
              <EmojiPicker onEmojiSelect={handleEmojiSelect}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </EmojiPicker>
              <FormatButton icon={ImageIcon} label="Attach image" />
              <FormatButton icon={Paperclip} label="Attach file" />
              <FormatButton icon={Mic} label="Record audio" />
            </div>
          </TooltipProvider>
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!content.trim()}
            className="h-8 gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
});
