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
  FieldError,
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
import { AsYouType, isValidPhoneNumber } from 'libphonenumber-js';

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

  const [countryId, setCountryId] = React.useState<string>('US');
  const [timezone, setTimezone] = React.useState<string>('America/New_York');
  React.useEffect(() => {
    const tz = primaryTzByCountry.get(countryId);
    if (tz) setTimezone(tz);
  }, [countryId, primaryTzByCountry]);
  const [mobile, setMobile] = React.useState('');
  const [mobileError, setMobileError] = React.useState<string | null>(null);

  const handleCountryChange = (id: string) => {
    setCountryId(id);
    const primaryTz = primaryTzByCountry.get(id);
    if (primaryTz) setTimezone(primaryTz);
  };

  const handleTimezoneChange = (tzName: string) => {
    setTimezone(tzName);
  };

  const handleMobileChange = (value: string) => {
    const formatter = new AsYouType();
    const formatted = formatter.input(value);
    const e164 = formatter.getNumberValue();

    setMobile(formatted);

    if (value.length === 0) {
      setMobileError(null);
      return;
    }

    if (!e164 || !isValidPhoneNumber(e164)) {
      setMobileError('Enter a valid international number (e.g., +15551234567).');
      return;
    }

    setMobileError(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formatter = new AsYouType();
    const formatted = formatter.input(mobile);
    const e164 = formatter.getNumberValue();
    if (!e164 || !isValidPhoneNumber(e164)) {
      setMobileError('Enter a valid international number (e.g., +15551234567).');
      return;
    }
    formData.set('mobile', e164);
    setMobileError(null);
    const entries = Array.from(
      (formData as any).entries() as Iterable<[string, FormDataEntryValue]>,
    );
    onSubmitProfile?.(Object.fromEntries(entries));
  };

  const availableTimezones = React.useMemo(() => {
    const country = countryData.find((c) => c.id === countryId);
    if (country?.timezones?.length) return country.timezones;
    return allTimezoneNames;
  }, [countryData, countryId, allTimezoneNames]);

  return (
    <Card className={cn('w-full max-w-md', className)} {...props}>
      <CardHeader>
        <div className="text-center space-y-3">
          <div className="mx-auto flex items-center justify-center rounded-full p-1">
            <Logo aria-hidden="true" className="h-12 w-auto" />
          </div>
          <CardTitle className="text-4xl font-extrabold">Complete your profile</CardTitle>
          <CardDescription>Tell us about you to create your account</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FieldGroup className="space-y-6">
            <FieldSet>
              <FieldLegend>Basic info</FieldLegend>
              <Field>
                <FieldLabel htmlFor="fullName">Parent&apos;s Full name</FieldLabel>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your name here"
                  required
                />
              </Field>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>How can we reach you?</FieldLegend>
              <Field data-invalid={mobileError ? '' : undefined}>
                <FieldLabel htmlFor="mobile">Mobile number</FieldLabel>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  required
                  placeholder="+1 (555) 123-4567"
                  value={mobile}
                  onChange={(e) => handleMobileChange(e.target.value)}
                  aria-invalid={!!mobileError}
                />
                {mobileError ? <FieldError>{mobileError}</FieldError> : null}
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
              <FieldLegend>Where you are from?</FieldLegend>
              <Field>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <Input id="city" name="city" placeholder="Colombo" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Select
                  name="country"
                  value={countryId}
                  onValueChange={handleCountryChange}
                  required
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

              <Field>
                <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                <Select
                  name="timezone"
                  value={timezone}
                  onValueChange={handleTimezoneChange}
                  required
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
              <FieldLegend>How did you hear about us?</FieldLegend>
              <Field>
                <Textarea
                  id="heard"
                  name="heard"
                  placeholder="Friend (include their names), social media, ad, etc."
                  className="min-h-[196px]"
                  required={false}
                />
                <FieldDescription>Optional, but it helps us improve.</FieldDescription>
              </Field>
            </FieldSet>

            <Field>
              <Button type="submit" className="w-full justify-center">
                Complete
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
