import * as React from 'react';
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Globe,
  Languages,
  Palette,
  X,
} from 'lucide-react';

import { getAllTimezones } from 'countries-and-timezones';
import type { ThemeKey, UserProfileVM } from '@iconicedu/shared-types';
import { BorderBeam } from '../../../ui/border-beam';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select';
import { UserSettingsTabSection } from './components/user-settings-tab-section';

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
    timezone?: string,
    locale?: string | null,
    languagesSpoken?: string[] | null,
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
  const timezoneOptions = React.useMemo(() => {
    const values = Object.values(getAllTimezones())
      .map((timezone) => timezone.name)
      .filter(Boolean);
    return values.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }, []);

  const browserTimezone = React.useMemo(() => {
    if (typeof Intl === 'undefined' || typeof Intl.DateTimeFormat !== 'function') {
      return null;
    }
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
  }, []);

  const [timezoneValue, setTimezoneValue] = React.useState(
    prefs.timezone?.trim() ?? browserTimezone ?? '',
  );
  const [isTimezoneFocused, setIsTimezoneFocused] = React.useState(false);
  const [isToastDismissed, setIsToastDismissed] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const timezoneInputRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (prefs.timezone?.trim()) {
      setTimezoneValue(prefs.timezone);
      return;
    }
    if (browserTimezone && timezoneOptions.includes(browserTimezone)) {
      setTimezoneValue(browserTimezone);
      return;
    }
    setTimezoneValue('');
  }, [browserTimezone, prefs.timezone, timezoneOptions]);

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
    setIsSaving(true);
    try {
      await onTimezoneContinue(
        trimmed || undefined,
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
          <UserSettingsTabSection
            icon={<Palette className="h-5 w-5" />}
            title="Accent color"
            subtitle={currentThemeLabel}
          >
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
          </UserSettingsTabSection>
        </div>
        <div className="space-y-1 w-full">
          <UserSettingsTabSection
            icon={<Clock className="h-5 w-5" />}
            title="Timezone"
            subtitle={prefs.timezone}
            open={expandTimezone || undefined}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="settings-timezone">Timezone</Label>
                <div className="relative rounded-full" ref={timezoneInputRef}>
                  {expandTimezone && !timezoneValue.trim() && !isTimezoneFocused ? (
                    <BorderBeam
                      size={60}
                      initialOffset={20}
                      borderWidth={2}
                      className="from-transparent via-pink-500 to-transparent"
                      transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                    />
                  ) : null}
                  <Select
                    value={timezoneValue}
                    onValueChange={(value) => setTimezoneValue(value)}
                  >
                    <SelectTrigger
                      id="settings-timezone"
                      className="w-full"
                      onFocus={() => setIsTimezoneFocused(true)}
                      onBlur={() => setIsTimezoneFocused(false)}
                    >
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72 overflow-y-auto">
                      {timezoneOptions.map((timezone) => (
                        <SelectItem key={timezone} value={timezone}>
                          <div className="break-words">{timezone}</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="sm:col-span-2 flex items-center justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (browserTimezone) {
                      setTimezoneValue(browserTimezone);
                    }
                  }}
                  disabled={!browserTimezone}
                >
                  Pick timezone for me
                </Button>
                {expandTimezone && onTimezoneContinue ? (
                  <Button size="sm" onClick={handleTimezoneContinue} disabled={isSaving}>
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
          </UserSettingsTabSection>
        </div>
        <div className="space-y-1 w-full">
          <UserSettingsTabSection
            icon={<Globe className="h-5 w-5" />}
            title="Locale"
            subtitle={prefs.locale ?? 'Auto'}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="settings-locale">Locale</Label>
                <Input id="settings-locale" defaultValue={prefs.locale ?? ''} />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <Button size="sm">Save</Button>
              </div>
            </div>
          </UserSettingsTabSection>
        </div>
        <div className="space-y-1 w-full">
          <UserSettingsTabSection
            icon={<Languages className="h-5 w-5" />}
            title="Languages spoken"
            subtitle={
              prefs.languagesSpoken?.length ? prefs.languagesSpoken.join(', ') : 'Not set'
            }
          >
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
          </UserSettingsTabSection>
        </div>
      </div>
    </div>
  );
}
