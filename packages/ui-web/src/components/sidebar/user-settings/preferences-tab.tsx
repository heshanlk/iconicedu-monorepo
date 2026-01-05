import * as React from 'react';
import { ArrowRight, ChevronRight, Clock, Globe, Languages, Palette, X } from 'lucide-react';

import type { ThemeKey, UserProfileVM } from '@iconicedu/shared-types';
import { BorderBeam } from '../../../ui/border-beam';
import { Button } from '../../../ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../ui/collapsible';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Separator } from '../../../ui/separator';

type PreferencesTabProps = {
  currentThemeKey: ThemeKey;
  currentThemeLabel: string;
  profileId: string;
  prefs: UserProfileVM['prefs'];
  profileThemeOptions: Array<{ value: string; label: string }>;
  setProfileThemes: React.Dispatch<React.SetStateAction<Record<string, ThemeKey>>>;
  showOnboardingToast?: boolean;
  expandTimezone?: boolean;
  scrollToRequired?: boolean;
  scrollToken?: number;
  onTimezoneContinue?: (
    timezone: string,
    locale: string | null,
    languagesSpoken: string[] | null,
  ) => Promise<void> | void;
};

export function PreferencesTab({
  currentThemeKey,
  currentThemeLabel,
  profileId,
  prefs,
  profileThemeOptions,
  setProfileThemes,
  showOnboardingToast = false,
  expandTimezone = false,
  scrollToRequired = false,
  scrollToken = 0,
  onTimezoneContinue,
}: PreferencesTabProps) {
  const [timezoneValue, setTimezoneValue] = React.useState(prefs.timezone ?? '');
  const [isTimezoneFocused, setIsTimezoneFocused] = React.useState(false);
  const [isToastDismissed, setIsToastDismissed] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [timezoneError, setTimezoneError] = React.useState<string | null>(null);
  const timezoneInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setTimezoneValue(prefs.timezone ?? '');
  }, [prefs.timezone]);

  React.useEffect(() => {
    if (!scrollToRequired || timezoneValue.trim()) {
      return;
    }
    if (timezoneInputRef.current) {
      requestAnimationFrame(() => {
        timezoneInputRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      });
    }
  }, [scrollToRequired, scrollToken, timezoneValue]);

  const showToast = showOnboardingToast && !isToastDismissed;

  const handleTimezoneContinue = React.useCallback(async () => {
    if (!onTimezoneContinue) {
      return;
    }
    const trimmed = timezoneValue.trim();
    if (!trimmed) {
      setTimezoneError('Timezone is required.');
      return;
    }
    setTimezoneError(null);
    setIsSaving(true);
    try {
      await onTimezoneContinue(
        trimmed,
        prefs.locale ?? null,
        prefs.languagesSpoken ?? null,
      );
    } finally {
      setIsSaving(false);
    }
  }, [onTimezoneContinue, prefs.languagesSpoken, prefs.locale, timezoneValue]);

  return (
    <div className="space-y-8 w-full">
      {showToast ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="font-medium text-foreground">
                Please fill out required details to continue.
              </div>
              <div className="text-muted-foreground">
                Fields marked as{' '}
                <span className="relative inline-flex items-center">
                  <BorderBeam
                    size={48}
                    initialOffset={12}
                    borderWidth={2}
                    className="from-transparent via-pink-500 to-transparent"
                    transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                  />
                  <span className="relative z-10 text-destructive">*</span>
                </span>{' '}
                are required.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsToastDismissed(true)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-semibold">Preferences</h3>
            <p className="text-sm text-muted-foreground">
              Update your locale, language, and appearance settings.
            </p>
          </div>
        </div>
        <div className="space-y-1 w-full">
          <Collapsible className="rounded-2xl w-full">
            <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                <Palette className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium">Accent color</div>
                <div className="text-xs text-muted-foreground">{currentThemeLabel}</div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="py-4 w-full">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Accent color</Label>
                  <Select
                    value={currentThemeKey}
                    onValueChange={(value) =>
                      setProfileThemes((prev) => ({
                        ...prev,
                        [profileId]: value as ThemeKey,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {profileThemeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className={`flex items-center gap-2 theme-${option.value}`}>
                            <span className="theme-swatch h-3.5 w-3.5 rounded-full" />
                            {option.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <Button size="sm">Save</Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Separator />
          <Collapsible className="rounded-2xl w-full" open={expandTimezone || undefined}>
            <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                <Clock className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium">Timezone</div>
                <div className="text-xs text-muted-foreground">{prefs.timezone}</div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="py-4 w-full">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="settings-timezone">
                    Timezone <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative rounded-full">
                    {expandTimezone && !timezoneValue.trim() && !isTimezoneFocused ? (
                      <BorderBeam
                        size={60}
                        initialOffset={20}
                        borderWidth={2}
                        className="from-transparent via-pink-500 to-transparent"
                        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                      />
                    ) : null}
                  <Input
                    id="settings-timezone"
                    value={timezoneValue}
                    ref={timezoneInputRef}
                    placeholder="America/New_York"
                    required
                      onFocus={() => setIsTimezoneFocused(true)}
                      onBlur={() => setIsTimezoneFocused(false)}
                      onChange={(event) => {
                        setTimezoneValue(event.target.value);
                        if (event.target.value.trim()) {
                          setTimezoneError(null);
                        }
                      }}
                    />
                  </div>
                  {timezoneError ? (
                    <p className="text-xs text-destructive">{timezoneError}</p>
                  ) : null}
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  {expandTimezone && onTimezoneContinue ? (
                    <Button
                      size="sm"
                      onClick={handleTimezoneContinue}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        'Saving...'
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  ) : (
                    <Button size="sm">Save</Button>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Separator />
          <Collapsible className="rounded-2xl w-full">
            <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                <Globe className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium">Locale</div>
                <div className="text-xs text-muted-foreground">
                  {prefs.locale ?? 'Auto'}
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="py-4 w-full">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="settings-locale">Locale</Label>
                  <Input id="settings-locale" defaultValue={prefs.locale ?? ''} />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <Button size="sm">Save</Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Separator />
          <Collapsible className="rounded-2xl w-full">
            <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                <Languages className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium">Languages spoken</div>
                <div className="text-xs text-muted-foreground">
                  {prefs.languagesSpoken?.length
                    ? prefs.languagesSpoken.join(', ')
                    : 'Not set'}
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="py-4 w-full">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="settings-languages">Languages spoken</Label>
                  <Input
                    id="settings-languages"
                    defaultValue={prefs.languagesSpoken?.join(', ') ?? ''}
                    placeholder="English, Spanish"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <Button size="sm">Save</Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
