import * as React from 'react';
import { ChevronRight, MapPin, X } from 'lucide-react';

import type { UserProfileVM } from '@iconicedu/shared-types';
import { BorderBeam } from '../../../ui/border-beam';
import { Button } from '../../../ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../ui/collapsible';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';

type LocationTabProps = {
  location?: UserProfileVM['location'] | null;
  showOnboardingToast?: boolean;
  expandLocation?: boolean;
  onLocationContinue?: (input: {
    city: string;
    region: string;
    postalCode: string;
    countryCode?: string | null;
    countryName?: string | null;
  }) => Promise<void> | void;
};

export function LocationTab({
  location,
  showOnboardingToast = false,
  expandLocation = false,
  onLocationContinue,
}: LocationTabProps) {
  const [isToastDismissed, setIsToastDismissed] = React.useState(false);
  const [cityValue, setCityValue] = React.useState(location?.city ?? '');
  const [regionValue, setRegionValue] = React.useState(location?.region ?? '');
  const [postalValue, setPostalValue] = React.useState(location?.postalCode ?? '');
  const [countryValue, setCountryValue] = React.useState(
    location?.countryName ?? location?.countryCode ?? '',
  );
  const [isCityFocused, setIsCityFocused] = React.useState(false);
  const [isRegionFocused, setIsRegionFocused] = React.useState(false);
  const [isPostalFocused, setIsPostalFocused] = React.useState(false);
  const [isCountryFocused, setIsCountryFocused] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<{
    city?: string | null;
    region?: string | null;
    postalCode?: string | null;
    country?: string | null;
  }>({});
  const showToast = showOnboardingToast && !isToastDismissed;

  React.useEffect(() => {
    setCityValue(location?.city ?? '');
    setRegionValue(location?.region ?? '');
    setPostalValue(location?.postalCode ?? '');
    setCountryValue(location?.countryName ?? location?.countryCode ?? '');
  }, [
    location?.city,
    location?.countryCode,
    location?.countryName,
    location?.postalCode,
    location?.region,
  ]);

  const handleLocationContinue = React.useCallback(async () => {
    if (!onLocationContinue) {
      return;
    }
    const city = cityValue.trim();
    const region = regionValue.trim();
    const postalCode = postalValue.trim();
    const countryName = countryValue.trim();
    const nextErrors = {
      city: city ? null : 'City is required.',
      region: region ? null : 'State is required.',
      postalCode: postalCode ? null : 'Zip is required.',
      country: countryName ? null : 'Country is required.',
    };
    const hasErrors = Object.values(nextErrors).some((value) => value);
    if (hasErrors) {
      setFieldErrors(nextErrors);
      return;
    }
    setFieldErrors({});
    setIsSaving(true);
    try {
      await onLocationContinue({
        city,
        region,
        postalCode,
        countryName,
      });
    } finally {
      setIsSaving(false);
    }
  }, [cityValue, countryValue, onLocationContinue, postalValue, regionValue]);

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
            <h3 className="text-base font-semibold">Location</h3>
            <p className="text-sm text-muted-foreground">
              Manage your country, region, and local address details.
            </p>
          </div>
        </div>
        <div className="space-y-1 w-full">
          <Collapsible className="rounded-2xl w-full" open={expandLocation || undefined}>
            <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                <MapPin className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium">Address</div>
                <div className="text-xs text-muted-foreground">
                  {location?.city ?? 'City'}, {location?.region ?? 'State'}{' '}
                  {location?.postalCode ?? 'Zip'} •{' '}
                  {location?.countryName ?? location?.countryCode ?? 'Country'}
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="py-4 w-full">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="settings-city">
                    City {expandLocation ? <span className="text-destructive">*</span> : null}
                  </Label>
                  <div className="relative rounded-full">
                    {expandLocation && !cityValue.trim() && !isCityFocused ? (
                      <BorderBeam
                        size={60}
                        initialOffset={20}
                        borderWidth={2}
                        className="from-transparent via-pink-500 to-transparent"
                        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                      />
                    ) : null}
                    <Input
                      id="settings-city"
                      value={cityValue}
                      required={expandLocation}
                      placeholder="City"
                      onFocus={() => setIsCityFocused(true)}
                      onBlur={() => setIsCityFocused(false)}
                      onChange={(event) => {
                        setCityValue(event.target.value);
                        if (event.target.value.trim()) {
                          setFieldErrors((prev) => ({ ...prev, city: null }));
                        }
                      }}
                    />
                  </div>
                  {fieldErrors.city ? (
                    <p className="text-xs text-destructive">{fieldErrors.city}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-region">
                    State {expandLocation ? <span className="text-destructive">*</span> : null}
                  </Label>
                  <div className="relative rounded-full">
                    {expandLocation && !regionValue.trim() && !isRegionFocused ? (
                      <BorderBeam
                        size={60}
                        initialOffset={20}
                        borderWidth={2}
                        className="from-transparent via-pink-500 to-transparent"
                        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                      />
                    ) : null}
                    <Input
                      id="settings-region"
                      value={regionValue}
                      required={expandLocation}
                      placeholder="State"
                      onFocus={() => setIsRegionFocused(true)}
                      onBlur={() => setIsRegionFocused(false)}
                      onChange={(event) => {
                        setRegionValue(event.target.value);
                        if (event.target.value.trim()) {
                          setFieldErrors((prev) => ({ ...prev, region: null }));
                        }
                      }}
                    />
                  </div>
                  {fieldErrors.region ? (
                    <p className="text-xs text-destructive">{fieldErrors.region}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-postal">
                    Zip {expandLocation ? <span className="text-destructive">*</span> : null}
                  </Label>
                  <div className="relative rounded-full">
                    {expandLocation && !postalValue.trim() && !isPostalFocused ? (
                      <BorderBeam
                        size={60}
                        initialOffset={20}
                        borderWidth={2}
                        className="from-transparent via-pink-500 to-transparent"
                        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                      />
                    ) : null}
                    <Input
                      id="settings-postal"
                      value={postalValue}
                      required={expandLocation}
                      placeholder="Zip"
                      onFocus={() => setIsPostalFocused(true)}
                      onBlur={() => setIsPostalFocused(false)}
                      onChange={(event) => {
                        setPostalValue(event.target.value);
                        if (event.target.value.trim()) {
                          setFieldErrors((prev) => ({ ...prev, postalCode: null }));
                        }
                      }}
                    />
                  </div>
                  {fieldErrors.postalCode ? (
                    <p className="text-xs text-destructive">{fieldErrors.postalCode}</p>
                  ) : null}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="settings-country">
                    Country{' '}
                    {expandLocation ? <span className="text-destructive">*</span> : null}
                  </Label>
                  <div className="relative rounded-full">
                    {expandLocation && !countryValue.trim() && !isCountryFocused ? (
                      <BorderBeam
                        size={60}
                        initialOffset={20}
                        borderWidth={2}
                        className="from-transparent via-pink-500 to-transparent"
                        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                      />
                    ) : null}
                    <Input
                      id="settings-country"
                      value={countryValue}
                      required={expandLocation}
                      placeholder="Country"
                      onFocus={() => setIsCountryFocused(true)}
                      onBlur={() => setIsCountryFocused(false)}
                      onChange={(event) => {
                        setCountryValue(event.target.value);
                        if (event.target.value.trim()) {
                          setFieldErrors((prev) => ({ ...prev, country: null }));
                        }
                      }}
                    />
                  </div>
                  {fieldErrors.country ? (
                    <p className="text-xs text-destructive">{fieldErrors.country}</p>
                  ) : null}
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  {expandLocation && onLocationContinue ? (
                    <Button
                      size="sm"
                      onClick={handleLocationContinue}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Continue'}
                    </Button>
                  ) : (
                    <Button size="sm">Save</Button>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
