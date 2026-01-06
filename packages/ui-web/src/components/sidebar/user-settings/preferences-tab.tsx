import * as React from 'react';
import {
  ArrowRight,
  Check,
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
const localeOptions = [
  { value: 'en-US', label: 'English (United States)' },
  { value: 'en-GB', label: 'English (United Kingdom)' },
  { value: 'es-419', label: 'Spanish (Latin America)' },
  { value: 'fr-CA', label: 'French (Canada)' },
  { value: 'fr-FR', label: 'French (France)' },
  { value: 'de-DE', label: 'German (Germany)' },
  { value: 'pt-BR', label: 'Portuguese (Brazil)' },
  { value: 'hi-IN', label: 'Hindi (India)' },
  { value: 'zh-CN', label: 'Chinese (Simplified)' },
  { value: 'ar-EG', label: 'Arabic (Egypt)' },
  { value: 'ja-JP', label: 'Japanese (Japan)' },
];
const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'de', label: 'German' },
  { value: 'hi', label: 'Hindi' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ar', label: 'Arabic' },
  { value: 'ru', label: 'Russian' },
  { value: 'si', label: 'Sinhala' },
];

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
  const [localeValue, setLocaleValue] = React.useState(prefs.locale ?? '');
  const [languageValue, setLanguageValue] = React.useState<string[]>(
    prefs.languagesSpoken ?? [],
  );

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
    setLocaleValue(prefs.locale ?? '');
    setLanguageValue(prefs.languagesSpoken ?? []);
  }, [prefs.locale, prefs.languagesSpoken]);

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
        localeValue?.trim() || null,
        languageValue.length ? languageValue : null,
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
                <Select
                  value={localeValue}
                  onValueChange={(value) => setLocaleValue(value)}
                >
                  <SelectTrigger id="settings-locale" className="w-full">
                    <SelectValue placeholder="Select locale" />
                  </SelectTrigger>
                  <SelectContent>
                    {localeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
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
            icon={<Languages className="h-5 w-5" />}
            title="Languages spoken"
            subtitle={languageValue.length ? languageValue.join(', ') : 'Not set'}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3 sm:col-span-2">
                <Label htmlFor="settings-languages">Languages spoken</Label>
                <div className="flex flex-wrap gap-2">
                  {languageValue.map((value) => {
                    const option = languageOptions.find((entry) => entry.value === value);
                    return (
                      <span
                        key={value}
                        className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium"
                      >
                        {option?.label ?? value}
                        <button
                          type="button"
                          onClick={() =>
                            setLanguageValue((prev) => prev.filter((entry) => entry !== value))
                          }
                          aria-label={`Remove ${option?.label ?? value}`}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {languageOptions.map((option) => {
                    const isSelected = languageValue.includes(option.value);
                    return (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => {
                          setLanguageValue((prev) =>
                            prev.includes(option.value)
                              ? prev.filter((entry) => entry !== option.value)
                              : [...prev, option.value],
                          );
                        }}
                        className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                          isSelected
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-foreground/60'
                        }`}
                      >
                        <span>{option.label}</span>
                        {isSelected ? <Check className="h-4 w-4" /> : null}
                      </button>
                    );
                  })}
                </div>
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
