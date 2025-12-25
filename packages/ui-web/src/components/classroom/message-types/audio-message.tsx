'use client';

import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Slider } from '../../../ui/slider';
import type { AudioRecordingMessage } from '@iconicedu/shared-types';
import { MessageBase, type MessageBaseProps } from '../message-base';
import { cn } from '../../../lib/utils';

interface AudioMessageProps extends Omit<MessageBaseProps, 'message' | 'children'> {
  message: AudioRecordingMessage;
}

export const AudioMessage = memo(function AudioMessage(props: AudioMessageProps) {
  const { message, ...baseProps } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [canPlay, setCanPlay] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handleCanPlay = () => setCanPlay(true);
    const handleError = () => setCanPlay(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !canPlay) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, canPlay]);

  const handleSeek = useCallback((value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <MessageBase message={message} {...baseProps}>
      {message.content && (
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words mb-3">
          {message.content}
        </p>
      )}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 max-w-sm border border-primary/20">
        <audio
          ref={audioRef}
          src={message.audioUrl}
          preload="metadata"
          aria-label="Audio message"
        />

        <div className="flex items-center gap-4">
          <Button
            onClick={togglePlayPause}
            disabled={!canPlay}
            size="icon"
            className={cn(
              'h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 hover:scale-105 active:scale-95 transition-all shadow-lg',
              !canPlay && 'opacity-50 cursor-not-allowed',
            )}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current ml-0.5" />
            )}
          </Button>

          <div className="flex-1 space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              disabled={!canPlay}
              className="cursor-pointer"
              aria-label="Audio progress"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{message.duration || formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </MessageBase>
  );
});
