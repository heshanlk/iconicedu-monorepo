'use client';

import * as React from 'react';
import { ArrowRight, MapPin, X } from 'lucide-react';

import { Country, State } from 'country-state-city';
import type { UserProfileVM } from '@iconicedu/shared-types';
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
import { postalExamples } from './constants';

type LocationTabProps = {
  location?: UserProfileVM['location'] | null;
  showOnboardingToast?: boolean;
  expandLocation?: boolean;
  scrollToRequired?: boolean;
  scrollToken?: number;
  onLocationContinue?: (input: {
    city: string;
    region: string;
    postalCode: string;
    countryCode?: string | null;
    countryName?: string | null;
    streetAddress?: string | null;
  }) => Promise<void> | void;
};

export function LocationTab({
  location,
  showOnboardingToast = false,
  expandLocation = false,
  scrollToRequired = false,
  scrollToken = 0,
  onLocationContinue,
}: LocationTabProps) {
  const [isToastDismissed, setIsToastDismissed] = React.useState(false);
  const [cityValue, setCityValue] = React.useState(location?.city ?? '');
  const [regionValue, setRegionValue] = React.useState(location?.region ?? '');
  const [postalValue, setPostalValue] = React.useState(location?.postalCode ?? '');
  const [streetValue, setStreetValue] = React.useState(location?.streetAddress ?? '');
  const [isCityFocused, setIsCityFocused] = React.useState(false);
  const [isRegionFocused, setIsRegionFocused] = React.useState(false);
  const [isPostalFocused, setIsPostalFocused] = React.useState(false);
  const [isCountryFocused, setIsCountryFocused] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPickingLocation, setIsPickingLocation] = React.useState(false);
  const [locationError, setLocationError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<{
    city?: string | null;
    region?: string | null;
    postalCode?: string | null;
    country?: string | null;
  }>({});
  const cityInputRef = React.useRef<HTMLInputElement | null>(null);
  const regionInputRef = React.useRef<HTMLInputElement | null>(null);
  const postalInputRef = React.useRef<HTMLInputElement | null>(null);
  const countryFieldRef = React.useRef<HTMLDivElement | null>(null);
  const showToast = showOnboardingToast && !isToastDismissed;

  const countries = React.useMemo(() => {
    return Country.getAllCountries()
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }, []);
  const [countryValue, setCountryValue] = React.useState(() => {
    if (location?.countryCode) {
      return location.countryCode;
    }
    return 'US';
  });
  const selectedCountry = React.useMemo(() => {
    return (
      countries.find((entry) => entry.isoCode === countryValue) ?? countries[0] ?? null
    );
  }, [countries, countryValue]);
  const stateOptions = React.useMemo(() => {
    if (!countryValue) {
      return [];
    }
    return State.getStatesOfCountry(countryValue).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    );
  }, [countryValue]);
  const postalPlaceholder =
    postalExamples[selectedCountry?.isoCode ?? ''] ?? 'Postal code';
  const isLocationRequiredMissing =
    !countryValue || !cityValue.trim() || !regionValue.trim() || !postalValue.trim();

  React.useEffect(() => {
    setCityValue(location?.city ?? '');
    setRegionValue(location?.region ?? '');
    setPostalValue(location?.postalCode ?? '');
    setStreetValue(location?.streetAddress ?? '');
    setCountryValue(
      location?.countryCode ??
        countries.find((entry) => entry.name === location?.countryName)?.isoCode ??
        'US',
    );
  }, [
    countries,
    location?.city,
    location?.countryCode,
    location?.countryName,
    location?.postalCode,
    location?.region,
    location?.streetAddress,
  ]);

  React.useEffect(() => {
    if (!scrollToRequired) {
      return;
    }
    const target = !countryValue.trim()
      ? countryFieldRef.current
      : !cityValue.trim()
        ? cityInputRef.current
        : !regionValue.trim()
          ? regionInputRef.current
          : !postalValue.trim()
            ? postalInputRef.current
            : cityInputRef.current;
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }, [cityValue, countryValue, postalValue, regionValue, scrollToRequired, scrollToken]);

  const handleCountryChange = React.useCallback((value: string) => {
    setCountryValue(value);
    setRegionValue('');
    setFieldErrors((prev) => ({ ...prev, country: null }));
  }, []);

  const handlePickLocation = React.useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation is not supported in this browser.');
      return;
    }
    setLocationError(null);
    setIsPickingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
          );
          if (!response.ok) {
            throw new Error('Unable to determine your location.');
          }
          const data = (await response.json()) as { address?: Record<string, string> };
          const address = data.address ?? {};
          const newCountry = (address.country_code ?? '').toUpperCase();
          if (newCountry) {
            const match = countries.find((entry) => entry.isoCode === newCountry);
            setCountryValue(match?.isoCode ?? newCountry);
          }
          const city =
            address.city ?? address.town ?? address.village ?? address.county ?? '';
          setCityValue(city);
          const region = address.state ?? address.region ?? '';
          setRegionValue(region);
          setPostalValue(address.postcode ?? '');
          setFieldErrors({});
        } catch (error) {
          console.error(error);
          setLocationError('Unable to determine your location.');
        } finally {
          setIsPickingLocation(false);
        }
      },
      (error) => {
        setIsPickingLocation(false);
        setLocationError(error.message ?? 'Unable to read your location.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, [countries]);

  const handleLocationContinue = React.useCallback(async () => {
    if (!onLocationContinue) {
      return;
    }
    const city = cityValue.trim();
    const region = regionValue.trim();
    const postalCode = postalValue.trim();
    const countryName = selectedCountry?.name ?? '';
    const streetAddress = streetValue.trim();
    const nextErrors = {
      city: city ? null : 'City is required.',
      region: region ? null : 'State is required.',
      postalCode: postalCode ? null : 'Zip is required.',
      country: countryValue ? null : 'Country is required.',
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
        countryCode: countryValue,
        countryName,
        streetAddress: streetAddress || undefined,
      });
    } finally {
      setIsSaving(false);
    }
  }, [
    countryValue,
    onLocationContinue,
    postalValue,
    regionValue,
    selectedCountry,
    streetValue,
    cityValue,
  ]);

  const showStateSelect = stateOptions.length > 0;

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
          <UserSettingsTabSection
            icon={<MapPin className="h-5 w-5" />}
            title="Address"
            subtitle={`${
              location?.city ?? 'City'
            }, ${location?.region ?? 'State'} ${location?.postalCode ?? 'Zip'} • ${
              location?.countryName ?? selectedCountry?.name ?? 'Country'
            }`}
            open={expandLocation || undefined}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2" ref={countryFieldRef}>
                <Label htmlFor="settings-country">
                  Country <span className="text-destructive">*</span>
                </Label>
                <div className="relative rounded-full">
                  {!countryValue && !isCountryFocused ? (
                    <BorderBeam
                      size={60}
                      initialOffset={20}
                      borderWidth={2}
                      className="from-transparent via-pink-500 to-transparent"
                      transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                    />
                  ) : null}
                  <Select
                    value={countryValue}
                    onValueChange={handleCountryChange}
                    onOpenChange={(open) => setIsCountryFocused(open)}
                  >
                    <SelectTrigger id="settings-country" className="w-full">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72 overflow-y-auto">
                      {countries.map((country) => (
                        <SelectItem key={country.isoCode} value={country.isoCode}>
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate">{country.name}</span>
                            <span>{country.flag}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {fieldErrors.country ? (
                  <p className="text-xs text-destructive">{fieldErrors.country}</p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="settings-street">Street address</Label>
                  <span className="text-xs text-muted-foreground">Optional</span>
                </div>
                <Input
                  id="settings-street"
                  value={streetValue}
                  onChange={(event) => setStreetValue(event.target.value)}
                  placeholder="123 Example St"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="settings-city">
                  City <span className="text-destructive">*</span>
                </Label>
                <div className="relative rounded-full">
                  {!cityValue.trim() && !isCityFocused ? (
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
                    ref={cityInputRef}
                    required
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
              <div className="space-y-2 sm:col-span-1">
                <Label htmlFor="settings-region">
                  State <span className="text-destructive">*</span>
                </Label>
                <div className="relative rounded-full">
                  {!regionValue.trim() && !isRegionFocused ? (
                    <BorderBeam
                      size={60}
                      initialOffset={20}
                      borderWidth={2}
                      className="from-transparent via-pink-500 to-transparent"
                      transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                    />
                  ) : null}
                  {showStateSelect ? (
                    <Select
                      value={regionValue}
                      onValueChange={(value) => {
                        setRegionValue(value);
                        if (value.trim()) {
                          setFieldErrors((prev) => ({ ...prev, region: null }));
                        }
                      }}
                      onOpenChange={(open) => setIsRegionFocused(open)}
                    >
                      <SelectTrigger id="settings-region" className="w-full">
                        <SelectValue placeholder="Select state / province" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72 overflow-y-auto">
                        {stateOptions.map((state) => (
                          <SelectItem key={state.isoCode} value={state.name}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="settings-region"
                      value={regionValue}
                      ref={regionInputRef}
                      required
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
                  )}
                </div>
                {fieldErrors.region ? (
                  <p className="text-xs text-destructive">{fieldErrors.region}</p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-1">
                <Label htmlFor="settings-postal">
                  Zip <span className="text-destructive">*</span>
                </Label>
                <div className="relative rounded-full">
                  {!postalValue.trim() && !isPostalFocused ? (
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
                    ref={postalInputRef}
                    required
                    placeholder={postalPlaceholder}
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
              <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePickLocation}
                  disabled={isPickingLocation}
                >
                  {isPickingLocation ? 'Picking location…' : 'Pick location for me'}
                </Button>
                <div className="flex gap-2">
                  {expandLocation && onLocationContinue ? (
                    <Button
                      size="sm"
                      onClick={handleLocationContinue}
                      disabled={isSaving || isLocationRequiredMissing}
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
                    <Button
                      size="sm"
                      onClick={handleLocationContinue}
                      disabled={isSaving || isLocationRequiredMissing}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  )}
                </div>
              </div>
              {locationError ? (
                <p className="text-xs text-destructive">{locationError}</p>
              ) : null}
            </div>
          </UserSettingsTabSection>
        </div>
      </div>
    </div>
  );
}
