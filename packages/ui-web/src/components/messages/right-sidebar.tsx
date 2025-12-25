import { useState, useEffect, type ReactNode } from 'react';
import { Button } from '../../ui/button';
import { X } from 'lucide-react';

interface RightSidebarProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}

export function RightSidebar({ title, subtitle, onClose, children }: RightSidebarProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setIsClosing(false);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match the animation duration
  };

  return (
    <aside
      className={`hidden md:flex w-[400px] flex-col border-l border-border bg-card duration-300 ${
        isClosing
          ? 'animate-out slide-out-to-right-12 fade-out'
          : 'animate-in slide-in-from-right-12 fade-in'
      }`}
      aria-label={title}
    >
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={handleClose}
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </aside>
  );
}
