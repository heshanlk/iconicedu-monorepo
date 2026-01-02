import * as React from 'react';
import { ChevronRight, Clock, Globe, Languages, Palette } from 'lucide-react';

import type { ThemeKey, UserProfileVM } from '@iconicedu/shared-types';
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
};

export function PreferencesTab({
  currentThemeKey,
  currentThemeLabel,
  profileId,
  prefs,
  profileThemeOptions,
  setProfileThemes,
}: PreferencesTabProps) {
  return (
    <div className="space-y-8 w-full">
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
          <Collapsible className="rounded-2xl w-full">
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
                  <Label htmlFor="settings-timezone">Timezone</Label>
                  <Input id="settings-timezone" defaultValue={prefs.timezone} />
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
