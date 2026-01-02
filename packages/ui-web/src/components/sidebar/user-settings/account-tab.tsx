import * as React from 'react';
import { BadgeCheck, ChevronRight, Mail, MessageCircle, Phone } from 'lucide-react';

import type { UserAccountVM } from '@iconicedu/shared-types';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../ui/collapsible';
import { Input } from '../../../ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../../../ui/input-group';
import { Label } from '../../../ui/label';
import { Separator } from '../../../ui/separator';
import { Switch } from '../../../ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../ui/tooltip';

type AccountTabProps = {
  contacts?: UserAccountVM['contacts'] | null;
  email: string;
  preferredChannelSelections: string[];
  togglePreferredChannel: (channel: string, enabled: boolean) => void;
};

export function AccountTab({
  contacts,
  email,
  preferredChannelSelections,
  togglePreferredChannel,
}: AccountTabProps) {
  return (
    <div className="space-y-8 w-full">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-semibold">Account Settings</h3>
            <p className="text-sm text-muted-foreground">
              Manage email, password, and contact verification settings.
            </p>
          </div>
        </div>
        <div className="space-y-1 w-full">
          <Collapsible className="rounded-2xl w-full">
            <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                <Mail className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium">Email</div>
                <div className="text-xs text-muted-foreground">
                  {contacts?.email ?? 'Not provided'}
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="py-4 w-full">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="settings-account-email">Email</Label>
                  <InputGroup>
                    <InputGroupInput
                      id="settings-account-email"
                      defaultValue={email}
                      aria-label="Email"
                    />
                    <InputGroupAddon align="inline-end">
                      {contacts?.emailVerified ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <BadgeCheck className="h-3 w-3" />
                          <span className="sr-only">Verified</span>
                        </Badge>
                      ) : (
                        <Badge className="bg-muted text-muted-foreground">
                          <BadgeCheck className="h-3 w-3 text-muted-foreground" />
                          <span className="sr-only">Not verified</span>
                        </Badge>
                      )}
                      {contacts?.verifiedAt ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs text-muted-foreground cursor-help">
                              Verified on
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>{contacts.verifiedAt}</TooltipContent>
                        </Tooltip>
                      ) : null}
                    </InputGroupAddon>
                  </InputGroup>
                </div>
                <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
                  <div>
                    <div className="text-sm font-medium">
                      Receive notifications by email
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Use this email for account alerts and reminders.
                    </div>
                  </div>
                  <Switch
                    checked={preferredChannelSelections.includes('email')}
                    onCheckedChange={(checked) =>
                      togglePreferredChannel('email', checked)
                    }
                    aria-label="Receive notifications by email"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="settings-account-password">New password</Label>
                  <Input id="settings-account-password" type="password" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="settings-account-password-confirm">
                    Confirm password
                  </Label>
                  <Input id="settings-account-password-confirm" type="password" />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <Button size="sm">Save</Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Separator />
        </div>
        <div className="space-y-1 w-full">
          <Collapsible className="rounded-2xl w-full">
            <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                <Phone className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium">Phone</div>
                <div className="text-xs text-muted-foreground">
                  {contacts?.phoneE164 ?? 'Not provided'}
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="py-4 w-full">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="settings-account-phone">Phone</Label>
                  <InputGroup>
                    <InputGroupInput
                      id="settings-account-phone"
                      defaultValue={contacts?.phoneE164 ?? ''}
                      aria-label="Phone"
                    />
                    <InputGroupAddon align="inline-end">
                      {contacts?.phoneVerified ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <BadgeCheck className="h-3 w-3" />
                          <span className="sr-only">Verified</span>
                        </Badge>
                      ) : (
                        <Badge className="bg-muted text-muted-foreground">
                          <BadgeCheck className="h-3 w-3 text-muted-foreground" />
                          <span className="sr-only">Not verified</span>
                        </Badge>
                      )}
                      {contacts?.verifiedAt ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs text-muted-foreground cursor-help">
                              Verified on
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>{contacts.verifiedAt}</TooltipContent>
                        </Tooltip>
                      ) : null}
                    </InputGroupAddon>
                  </InputGroup>
                  {contacts?.verifiedAt ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs text-muted-foreground cursor-help">
                          Verified on
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{contacts.verifiedAt}</TooltipContent>
                    </Tooltip>
                  ) : null}
                </div>
                {contacts?.phoneVerified ? (
                  <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
                    <div>
                      <div className="text-sm font-medium">
                        Receive notifications by phone
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Use SMS for alerts and reminders.
                      </div>
                    </div>
                    <Switch
                      checked={preferredChannelSelections.includes('sms')}
                      onCheckedChange={(checked) => togglePreferredChannel('sms', checked)}
                      aria-label="Receive notifications by phone"
                    />
                  </div>
                ) : null}
                <div className="sm:col-span-2 flex justify-end">
                  <Button size="sm">Save</Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Separator />
        </div>
        <div className="space-y-1 w-full">
          <Collapsible className="rounded-2xl w-full">
            <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium">WhatsApp</div>
                <div className="text-xs text-muted-foreground">
                  {contacts?.whatsappE164 ?? 'Not provided'}
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="py-4 w-full">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="settings-account-whatsapp">WhatsApp</Label>
                  <InputGroup>
                    <InputGroupInput
                      id="settings-account-whatsapp"
                      defaultValue={contacts?.whatsappE164 ?? ''}
                      aria-label="WhatsApp"
                    />
                    <InputGroupAddon align="inline-end">
                      {contacts?.whatsappVerified ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <BadgeCheck className="h-3 w-3" />
                          <span className="sr-only">Verified</span>
                        </Badge>
                      ) : (
                        <Badge className="bg-muted text-muted-foreground">
                          <BadgeCheck className="h-3 w-3 text-muted-foreground" />
                          <span className="sr-only">Not verified</span>
                        </Badge>
                      )}
                      {contacts?.verifiedAt ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs text-muted-foreground cursor-help">
                              Verified on
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>{contacts.verifiedAt}</TooltipContent>
                        </Tooltip>
                      ) : null}
                    </InputGroupAddon>
                  </InputGroup>
                  {contacts?.verifiedAt ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs text-muted-foreground cursor-help">
                          Verified on
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{contacts.verifiedAt}</TooltipContent>
                    </Tooltip>
                  ) : null}
                </div>
                {contacts?.whatsappVerified ? (
                  <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
                    <div>
                      <div className="text-sm font-medium">
                        Receive notifications by WhatsApp
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Use WhatsApp for alerts and reminders.
                      </div>
                    </div>
                    <Switch
                      checked={preferredChannelSelections.includes('whatsapp')}
                      onCheckedChange={(checked) =>
                        togglePreferredChannel('whatsapp', checked)
                      }
                      aria-label="Receive notifications by WhatsApp"
                    />
                  </div>
                ) : null}
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
