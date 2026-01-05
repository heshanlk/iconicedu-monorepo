import * as React from 'react';
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';
import { BadgeCheck, ChevronRight, Mail, MessageCircle, Phone, X } from 'lucide-react';

import type { UserAccountVM } from '@iconicedu/shared-types';
import { Badge } from '../../../ui/badge';
import { BorderBeam } from '../../../ui/border-beam';
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
  requirePhone?: boolean;
  expandPhone?: boolean;
  expandWhatsapp?: boolean;
  showOnboardingToast?: boolean;
  onPhoneContinue?: (phone: string) => Promise<void> | void;
  onWhatsappContinue?: (whatsapp: string) => Promise<void> | void;
};

export function AccountTab({
  contacts,
  email,
  preferredChannelSelections,
  togglePreferredChannel,
  requirePhone = false,
  expandPhone = false,
  expandWhatsapp = false,
  showOnboardingToast = false,
  onPhoneContinue,
  onWhatsappContinue,
}: AccountTabProps) {
  const [isAccountToastDismissed, setIsAccountToastDismissed] = React.useState(false);
  const [phoneValue, setPhoneValue] = React.useState(contacts?.phoneE164 ?? '');
  const [isPhoneFocused, setIsPhoneFocused] = React.useState(false);
  const [phoneError, setPhoneError] = React.useState<string | null>(null);
  const [whatsappValue, setWhatsappValue] = React.useState(contacts?.whatsappE164 ?? '');
  const [isWhatsappFocused, setIsWhatsappFocused] = React.useState(false);
  const [whatsappError, setWhatsappError] = React.useState<string | null>(null);
  const [isPhoneSaving, setIsPhoneSaving] = React.useState(false);
  const [isWhatsappSaving, setIsWhatsappSaving] = React.useState(false);
  const showToast = showOnboardingToast && !isAccountToastDismissed;
  const emailError = !email.trim() ? 'Email is required.' : null;

  const formatPhoneInput = React.useCallback((value: string) => {
    return new AsYouType().input(value);
  }, []);

  React.useEffect(() => {
    if (expandWhatsapp && !whatsappValue.trim() && phoneValue.trim()) {
      setWhatsappValue(phoneValue.trim());
    }
  }, [expandWhatsapp, phoneValue, whatsappValue]);

  React.useEffect(() => {
    if (!isPhoneFocused) {
      setPhoneValue(formatPhoneInput(contacts?.phoneE164 ?? ''));
    }
  }, [contacts?.phoneE164, formatPhoneInput, isPhoneFocused]);

  React.useEffect(() => {
    if (!isWhatsappFocused) {
      setWhatsappValue(formatPhoneInput(contacts?.whatsappE164 ?? ''));
    }
  }, [contacts?.whatsappE164, formatPhoneInput, isWhatsappFocused]);

  const handlePhoneContinue = React.useCallback(async () => {
    if (!onPhoneContinue) {
      return;
    }
    const parsed = parsePhoneNumberFromString(phoneValue);
    if (!phoneValue.trim()) {
      setPhoneError('Please enter your phone number.');
      return;
    }
    if (!parsed?.isValid()) {
      setPhoneError('Enter a valid international number (e.g. +1 415 555 0100).');
      return;
    }
    setIsPhoneSaving(true);
    try {
      await onPhoneContinue(parsed.number);
    } finally {
      setIsPhoneSaving(false);
    }
  }, [onPhoneContinue, phoneValue]);

  const handleWhatsappContinue = React.useCallback(async () => {
    if (!onWhatsappContinue) {
      return;
    }
    const parsed = parsePhoneNumberFromString(whatsappValue);
    if (!whatsappValue.trim()) {
      setWhatsappError('Please enter your WhatsApp number.');
      return;
    }
    if (!parsed?.isValid()) {
      setWhatsappError('Enter a valid international number (e.g. +1 415 555 0100).');
      return;
    }
    setIsWhatsappSaving(true);
    try {
      await onWhatsappContinue(parsed.number);
    } finally {
      setIsWhatsappSaving(false);
    }
  }, [onWhatsappContinue, whatsappValue]);

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
              onClick={() => setIsAccountToastDismissed(true)}
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
              {contacts?.emailVerified ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <BadgeCheck className="h-3 w-3" />
                      <span className="sr-only">Verified</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>{contacts.emailVerifiedAt}</TooltipContent>
                </Tooltip>
              ) : (
                <Badge className="bg-muted text-muted-foreground">
                  <BadgeCheck className="h-3 w-3 text-muted-foreground" />
                  <span className="sr-only">Not verified</span>
                </Badge>
              )}
              <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="py-4 w-full">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="settings-account-email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <InputGroup>
                    <InputGroupInput
                      id="settings-account-email"
                      defaultValue={email}
                      aria-label="Email"
                      required
                    />
                    <InputGroupAddon align="inline-end">
                      {contacts?.emailVerified ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              <BadgeCheck className="h-3 w-3" />
                              <span className="sr-only">Verified</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>{contacts.emailVerifiedAt}</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Badge className="bg-muted text-muted-foreground">
                          <BadgeCheck className="h-3 w-3 text-muted-foreground" />
                          <span className="sr-only">Not verified</span>
                        </Badge>
                      )}
                    </InputGroupAddon>
                  </InputGroup>
                  {emailError ? (
                    <p className="text-xs text-destructive">{emailError}</p>
                  ) : null}
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
                <div className="sm:col-span-2 flex justify-end">
                  <Button size="sm">Save</Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="space-y-1 w-full">
          <Collapsible className="rounded-2xl w-full" open={expandPhone || undefined}>
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
              {contacts?.phoneVerified ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <BadgeCheck className="h-3 w-3" />
                      <span className="sr-only">Verified</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>{contacts.phoneVerifiedAt}</TooltipContent>
                </Tooltip>
              ) : (
                <Badge className="bg-muted text-muted-foreground">
                  <BadgeCheck className="h-3 w-3 text-muted-foreground" />
                  <span className="sr-only">Not verified</span>
                </Badge>
              )}
              <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="py-4 w-full">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="settings-account-phone">
                    Phone{' '}
                    {expandPhone || requirePhone ? (
                      <span className="text-destructive">*</span>
                    ) : null}
                  </Label>
                  <div className="relative rounded-full">
                    {(expandPhone || requirePhone) &&
                    !phoneValue.trim() &&
                    !isPhoneFocused ? (
                      <BorderBeam
                        size={60}
                        initialOffset={20}
                        borderWidth={2}
                        className="from-transparent via-pink-500 to-transparent"
                        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                      />
                    ) : null}
                    <InputGroup>
                      <InputGroupInput
                        id="settings-account-phone"
                        value={phoneValue}
                        aria-label="Phone"
                        required={expandPhone || requirePhone}
                        placeholder="+1 415 555 0100"
                        onFocus={() => setIsPhoneFocused(true)}
                        onBlur={() => {
                          setIsPhoneFocused(false);
                          const formatted = formatPhoneInput(phoneValue);
                          if (formatted) {
                            setPhoneValue(formatted);
                          }
                        }}
                        onChange={(event) => {
                          setPhoneValue(formatPhoneInput(event.target.value));
                          if (phoneError) {
                            setPhoneError(null);
                          }
                        }}
                      />
                      <InputGroupAddon align="inline-end">
                        {contacts?.phoneVerified ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                <BadgeCheck className="h-3 w-3" />
                                <span className="sr-only">Verified</span>
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>{contacts.phoneVerifiedAt}</TooltipContent>
                          </Tooltip>
                        ) : (
                          <Badge className="bg-muted text-muted-foreground">
                            <BadgeCheck className="h-3 w-3 text-muted-foreground" />
                            <span className="sr-only">Not verified</span>
                          </Badge>
                        )}
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    We’ll send a verification code by text. Include your country code
                    (e.g. +1, +44, +61).
                  </div>
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
                      onCheckedChange={(checked) =>
                        togglePreferredChannel('sms', checked)
                      }
                      aria-label="Receive notifications by phone"
                    />
                  </div>
                ) : null}
                <div className="sm:col-span-2 flex justify-end">
                  {expandPhone && onPhoneContinue ? (
                    <Button
                      size="sm"
                      onClick={handlePhoneContinue}
                      disabled={isPhoneSaving}
                    >
                      {isPhoneSaving ? 'Saving...' : 'Continue'}
                    </Button>
                  ) : (
                    <Button size="sm">Save</Button>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Separator />
        </div>
        <div className="space-y-1 w-full">
          <Collapsible className="rounded-2xl w-full" open={expandWhatsapp || undefined}>
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
              {contacts?.whatsappVerified ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <BadgeCheck className="h-3 w-3" />
                      <span className="sr-only">Verified</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>{contacts.whatsappVerifiedAt}</TooltipContent>
                </Tooltip>
              ) : (
                <Badge className="bg-muted text-muted-foreground">
                  <BadgeCheck className="h-3 w-3 text-muted-foreground" />
                  <span className="sr-only">Not verified</span>
                </Badge>
              )}
              <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="py-4 w-full">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="settings-account-whatsapp">WhatsApp</Label>
                  <div className="relative rounded-full">
                    {expandWhatsapp && !whatsappValue.trim() && !isWhatsappFocused ? (
                      <BorderBeam
                        size={60}
                        initialOffset={20}
                        borderWidth={2}
                        className="from-transparent via-pink-500 to-transparent"
                        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                      />
                    ) : null}
                    <InputGroup>
                      <InputGroupInput
                        id="settings-account-whatsapp"
                        value={whatsappValue}
                        aria-label="WhatsApp"
                        required={expandWhatsapp}
                        placeholder="+1 415 555 0100"
                        onFocus={() => setIsWhatsappFocused(true)}
                        onBlur={() => {
                          setIsWhatsappFocused(false);
                          const formatted = formatPhoneInput(whatsappValue);
                          if (formatted) {
                            setWhatsappValue(formatted);
                          }
                        }}
                        onChange={(event) => {
                          setWhatsappValue(formatPhoneInput(event.target.value));
                          if (whatsappError) {
                            setWhatsappError(null);
                          }
                        }}
                      />
                      <InputGroupAddon align="inline-end">
                        {contacts?.whatsappVerified ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                <BadgeCheck className="h-3 w-3" />
                                <span className="sr-only">Verified</span>
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>{contacts.whatsappVerifiedAt}</TooltipContent>
                          </Tooltip>
                        ) : (
                          <Badge className="bg-muted text-muted-foreground">
                            <BadgeCheck className="h-3 w-3 text-muted-foreground" />
                            <span className="sr-only">Not verified</span>
                          </Badge>
                        )}
                      </InputGroupAddon>
                    </InputGroup>
                    <div className="text-xs text-muted-foreground">
                      We’ll send a verification code by text. Include your country code
                      (e.g. +1, +44, +61).
                    </div>
                    {whatsappError ? (
                      <div className="text-xs text-destructive">{whatsappError}</div>
                    ) : null}
                  </div>
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
                  {expandWhatsapp && onWhatsappContinue ? (
                    <Button
                      size="sm"
                      onClick={handleWhatsappContinue}
                      disabled={isWhatsappSaving}
                    >
                      {isWhatsappSaving ? 'Saving...' : 'Continue'}
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
