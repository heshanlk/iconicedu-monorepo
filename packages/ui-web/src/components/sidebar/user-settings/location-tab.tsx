import * as React from 'react';
import { ChevronRight, MapPin } from 'lucide-react';

import type { UserProfileVM } from '@iconicedu/shared-types';
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
};

export function LocationTab({ location }: LocationTabProps) {
  return (
    <div className="space-y-8 w-full">
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
          <Collapsible className="rounded-2xl w-full">
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
                  <Label htmlFor="settings-city">City</Label>
                  <Input id="settings-city" defaultValue={location?.city ?? ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-region">State</Label>
                  <Input id="settings-region" defaultValue={location?.region ?? ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-postal">Zip</Label>
                  <Input id="settings-postal" defaultValue={location?.postalCode ?? ''} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="settings-country">Country</Label>
                  <Input
                    id="settings-country"
                    defaultValue={location?.countryName ?? location?.countryCode ?? ''}
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
