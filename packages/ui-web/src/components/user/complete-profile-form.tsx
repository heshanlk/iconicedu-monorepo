'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '../ui/field';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Logo } from '../icons/logo';
import { getAllCountries, getAllTimezones } from 'countries-and-timezones';
import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export interface CompleteProfileFormProps extends React.ComponentProps<typeof Card> {
  onSubmitProfile?: (data: Record<string, FormDataEntryValue>) => void;
}

export function CompleteProfileForm({
  className,
  onSubmitProfile,
  ...props
}: CompleteProfileFormProps) {
  const [hasWhatsapp, setHasWhatsapp] = React.useState(false);
  const countryData = React.useMemo(() => Object.values(getAllCountries()), []);
  const timezoneData = React.useMemo(() => Object.values(getAllTimezones()), []);

  const countries = React.useMemo(
    () => countryData.sort((a, b) => a.name.localeCompare(b.name)),
    [countryData],
  );
  const timezones = React.useMemo(
    () => timezoneData.sort((a, b) => a.name.localeCompare(b.name)),
    [timezoneData],
  );

  const allTimezoneNames = React.useMemo(
    () => timezones.map((tz) => tz.name),
    [timezones],
  );

  const primaryTzByCountry = React.useMemo(() => {
    const map = new Map<string, string>();
    countryData.forEach((c) => {
      if (c.timezones?.length) map.set(c.id, c.timezones[0]);
    });
    return map;
  }, [countryData]);

  const countryByTimezone = React.useMemo(() => {
    const map = new Map<string, string>();
    timezoneData.forEach((tz) => {
      const first = tz.countries?.[0];
      if (first) map.set(tz.name, first);
    });
    return map;
  }, [timezoneData]);

  const [countryId, setCountryId] = React.useState<string>('');
  const [timezone, setTimezone] = React.useState<string>('');

  const handleCountryChange = (id: string) => {
    setCountryId(id);
    const tz = primaryTzByCountry.get(id);
    if (tz) setTimezone(tz);
    else setTimezone('');
  };

  const handleTimezoneChange = (tzName: string) => {
    setTimezone(tzName);
    const c = countryByTimezone.get(tzName);
    if (c) setCountryId(c);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
  };

  const availableTimezones = React.useMemo(() => {
    if (countryId) {
      const country = countryData.find((c) => c.id === countryId);
      if (country?.timezones?.length) return country.timezones;
    }
    return allTimezoneNames;
  }, [countryId, countryData, allTimezoneNames]);

  return (
    <Card className={cn('w-full max-w-md', className)} {...props}>
      <CardHeader>
        <div className="text-center space-y-3">
          <div className="mx-auto flex items-center justify-center rounded-full bg-secondary/60 p-1">
            <Logo aria-hidden="true" className="h-8 w-auto text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold">Complete your profile</CardTitle>
          <CardDescription>Tell us about you to create your account.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FieldGroup className="space-y-6">
            <FieldSet>
              <FieldLegend>Basic info</FieldLegend>
              <FieldDescription>
                Who are you? We&apos;ll use this on your profile.
              </FieldDescription>
              <Field>
                <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                <Input id="fullName" name="fullName" required placeholder="Jane Doe" />
                <FieldDescription>This will appear on your account.</FieldDescription>
              </Field>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>Contact</FieldLegend>
              <FieldDescription>How can we reach you?</FieldDescription>
              <Field>
                <FieldLabel htmlFor="mobile">Mobile number</FieldLabel>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  required
                  placeholder="+1 (555) 123-4567"
                />
                <label className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    name="hasWhatsapp"
                    checked={hasWhatsapp}
                    onChange={(e) => setHasWhatsapp(e.target.checked)}
                  />
                  Uses WhatsApp
                </label>
              </Field>
              <Field>
                <FieldLabel htmlFor="contactMethod">Preferred contact method</FieldLabel>
                <div className="flex flex-col gap-3 rounded-md border border-border p-3">
                  <label className="flex items-center gap-3 text-sm">
                    <Checkbox name="contactEmail" className="text-primary" />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm text-foreground">
                    <Checkbox name="contactPhone" className="text-primary" />
                    <span>Phone</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm text-foreground">
                    <Checkbox name="contactWhatsapp" className="text-primary" />
                    <span>WhatsApp</span>
                  </label>
                </div>
              </Field>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>Location</FieldLegend>
              <FieldDescription>
                Helps us schedule and find the right fit.
              </FieldDescription>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="city">City</FieldLabel>
                  <Input id="city" name="city" placeholder="Colombo" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="country">Country</FieldLabel>
                  <Select
                    name="country"
                    value={countryId}
                    onValueChange={handleCountryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => {
                        return (
                          <SelectItem key={country.id} value={country.id}>
                            {country.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                <Select
                  name="timezone"
                  value={timezone}
                  onValueChange={handleTimezoneChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimezones.map((tzName) => (
                      <SelectItem key={tzName} value={tzName}>
                        {tzName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>Discovery</FieldLegend>
              <FieldDescription>How did you hear about us?</FieldDescription>
              <Field>
                <Textarea
                  id="heard"
                  name="heard"
                  placeholder="Friend, social media, ad, etc."
                  className="min-h-[96px]"
                />
                <FieldDescription>Optional, but it helps us improve.</FieldDescription>
              </Field>
            </FieldSet>

            <Field>
              <Button type="submit" className="w-full justify-center">
                Continue
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
