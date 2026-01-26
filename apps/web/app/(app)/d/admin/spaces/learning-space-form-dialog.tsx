'use client';

import * as React from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldSeparator,
  Input,
  ScrollArea,
  ScrollBar,
  Plus,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  toast,
  ResourceLinksEditor,
  ParticipantSelector,
} from '@iconicedu/ui-web';
import { Textarea } from '@iconicedu/ui-web/ui/textarea';
import {
  DEFAULT_LEARNING_SPACE_ICON_KEY,
  LEARNING_SPACE_ICON_MAP,
  LEARNING_SPACE_ICON_OPTIONS,
  type LearningSpaceIconKey,
} from '@iconicedu/ui-web/lib/icons';
import type { LearningSpaceLinkVM, UserProfileVM } from '@iconicedu/shared-types';

const KIND_OPTIONS = [
  { value: 'one_on_one', label: 'One on one' },
  { value: 'small_group', label: 'Small group' },
  { value: 'large_class', label: 'Large class' },
];

const SUBJECT_OPTIONS = ['MATH', 'SCIENCE', 'ELA', 'CHESS'];

const PARTICIPANT_USERS: UserProfileVM[] = [
  {
    kind: 'guardian',
    ids: {
      id: 'profile-guardian-1',
      orgId: 'org-1',
      accountId: 'account-guardian-1',
    },
    profile: {
      displayName: 'Jordan Rivera',
      firstName: 'Jordan',
      lastName: 'Rivera',
      bio: 'Parent of Leila Rivera',
      avatar: {
        source: 'seed',
        seed: 'jordan-rivera',
        url: null,
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    },
    prefs: {},
    meta: {
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
    status: 'active',
    joinedDate: '2025-01-01T00:00:00.000Z',
  },
  {
    kind: 'child',
    ids: {
      id: 'profile-child-1',
      orgId: 'org-1',
      accountId: 'account-child-1',
    },
    profile: {
      displayName: 'Leila Rivera',
      firstName: 'Leila',
      lastName: 'Rivera',
      bio: 'Grade 4',
      avatar: {
        source: 'seed',
        seed: 'leila-rivera',
        url: null,
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    },
    prefs: {},
    meta: {
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
    status: 'active',
  },
  {
    kind: 'educator',
    ids: {
      id: 'profile-educator-1',
      orgId: 'org-1',
      accountId: 'account-educator-1',
    },
    profile: {
      displayName: 'Sophie Lee',
      firstName: 'Sophie',
      lastName: 'Lee',
      bio: 'Math educator',
      avatar: {
        source: 'seed',
        seed: 'sophie-lee',
        url: null,
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    },
    prefs: {},
    meta: {
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
    status: 'active',
    joinedDate: '2025-01-01T00:00:00.000Z',
  },
] as const;

export function LearningSpaceFormDialog() {
  const [open, setOpen] = React.useState(false);
  const [kind, setKind] = React.useState(KIND_OPTIONS[0].value);
  const [title, setTitle] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [iconKey, setIconKey] = React.useState<LearningSpaceIconKey>(
    DEFAULT_LEARNING_SPACE_ICON_KEY,
  );
  const [primaryChannel, setPrimaryChannel] = React.useState('');
  const [relatedChannels, setRelatedChannels] = React.useState('');
  const [scheduleSeries, setScheduleSeries] = React.useState('');
  const [participants, setParticipants] = React.useState<UserProfileVM[]>([]);
  const [resources, setResources] = React.useState<LearningSpaceLinkVM[]>([]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const SelectedIcon = LEARNING_SPACE_ICON_MAP[iconKey];
  const iconInvalid = isSubmitted && !iconKey;
  const titleInvalid = isSubmitted && !title.trim();
  const kindInvalid = isSubmitted && !kind;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (!iconKey || !title.trim() || !kind) {
      toast.error('Please fill in all required fields.');
      return;
    }
    toast.success('Learning space placeholder created');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="flex items-center gap-2">
          <Plus className="size-4" />
          Add new
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[min(95vw,30rem)] sm:max-w-[min(95vw,30rem)] max-w-none overflow-hidden p-0">
        <div className="flex max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-border bg-card">
          <div className="px-6 py-5">
            <DialogHeader>
              <DialogTitle>Create learning space</DialogTitle>
              <DialogDescription>
                Configure the basics, invite participants, and attach resources for the
                learning space.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
            <ScrollArea className="flex flex-1 flex-col min-h-0">
              <form
                id="learning-space-form"
                onSubmit={handleSubmit}
                className="flex w-full flex-1 flex-col gap-4 px-6 pb-6 pt-2 min-h-0"
              >
                <FieldSet>
                  <FieldLegend variant="label">Basics</FieldLegend>
                  <FieldDescription>
                    Define the core details, subject, icon, and kind for this learning
                    space.
                  </FieldDescription>
                  <FieldGroup className="grid gap-3 md:grid-cols-[auto_minmax(0,1fr)]">
                    <Field data-invalid={iconInvalid} className="items-center gap-2">
                      <FieldLabel htmlFor="ls-icon">
                        Icon <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Select
                        id="ls-icon"
                        value={iconKey}
                        onValueChange={(value) =>
                          setIconKey(value as LearningSpaceIconKey)
                        }
                      >
                        <SelectTrigger
                          aria-label="Select icon"
                          className="flex size-9 items-center justify-center rounded-full border border-border bg-muted"
                        >
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {LEARNING_SPACE_ICON_OPTIONS.map((option) => {
                              const Icon = LEARNING_SPACE_ICON_MAP[option.value];
                              return (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="size-4" aria-hidden />
                                    <span>{option.label}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {iconInvalid && (
                        <FieldDescription className="text-destructive">
                          Please choose an icon for this learning space.
                        </FieldDescription>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="ls-title">
                        Title <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id="ls-title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                        aria-invalid={titleInvalid}
                      />
                      {titleInvalid && (
                        <FieldDescription className="text-destructive">
                          Title is required.
                        </FieldDescription>
                      )}
                    </Field>
                  </FieldGroup>
                  <FieldGroup className="grid gap-3 md:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="ls-subject">Subject</FieldLabel>
                      <Select
                        id="ls-subject"
                        value={subject}
                        onValueChange={(value) => setSubject(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Subjects</SelectLabel>
                            {SUBJECT_OPTIONS.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field data-invalid={kindInvalid}>
                      <FieldLabel htmlFor="ls-kind">
                        Kind <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Select
                        id="ls-kind"
                        value={kind}
                        onValueChange={(value) => setKind(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select kind" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Learning kinds</SelectLabel>
                            {KIND_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {kindInvalid && (
                        <FieldDescription className="text-destructive">
                          Kind is required for the learning space.
                        </FieldDescription>
                      )}
                    </Field>
                  </FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="ls-description">Description</FieldLabel>
                    <Textarea
                      id="ls-description"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      rows={3}
                    />
                  </Field>
                </FieldSet>
                <FieldSeparator />
                <FieldSet>
                  <ResourceLinksEditor links={resources} onLinksChange={setResources} />
                </FieldSet>
                <FieldSeparator />
                <FieldSet>
                  <FieldLegend variant="label">Participants</FieldLegend>
                  <FieldDescription>
                    Select families and educators with grouped chips for quick selection.
                  </FieldDescription>
                  <FieldGroup>
                    <ParticipantSelector
                      users={PARTICIPANT_USERS}
                      selectedUsers={participants}
                      onUserAdd={(user) =>
                        setParticipants((prev) =>
                          prev.some((item) => item.ids.id === user.ids.id)
                            ? prev
                            : [...prev, user],
                        )
                      }
                      onUserRemove={(user) =>
                        setParticipants((prev) =>
                          prev.filter((item) => item.ids.id !== user.ids.id),
                        )
                      }
                      placeholder="Add participant"
                    />
                  </FieldGroup>
                </FieldSet>
                <FieldSeparator />
                <FieldSet>
                  <FieldLegend variant="label">Channels</FieldLegend>
                  <FieldDescription>
                    Connect the learning space to existing channels.
                  </FieldDescription>
                  <FieldGroup className="grid gap-3 md:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="ls-primary-channel">
                        Primary channel
                      </FieldLabel>
                      <Input
                        id="ls-primary-channel"
                        value={primaryChannel}
                        onChange={(event) => setPrimaryChannel(event.target.value)}
                        placeholder="channel id or slug"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="ls-related-channels">
                        Related channels
                      </FieldLabel>
                      <Textarea
                        id="ls-related-channels"
                        value={relatedChannels}
                        onChange={(event) => setRelatedChannels(event.target.value)}
                        rows={2}
                        placeholder="comma-separated channels"
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <FieldSeparator />
                <FieldSet>
                  <FieldLegend variant="label">Schedule</FieldLegend>
                  <FieldDescription>
                    Configure the recurring schedule for this learning space.
                  </FieldDescription>
                  <Field>
                    <FieldLabel htmlFor="ls-schedule">Schedule series</FieldLabel>
                    <Input
                      id="ls-schedule"
                      value={scheduleSeries}
                      onChange={(event) => setScheduleSeries(event.target.value)}
                    />
                  </Field>
                </FieldSet>
              </form>
              <ScrollBar orientation="vertical" className="right-2" />
            </ScrollArea>
            <div className="border-t border-border bg-card px-6 py-4">
              <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="ghost" onClick={() => setOpen(false)} type="button">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="learning-space-form"
                  className="w-full sm:w-auto"
                >
                  Create space
                </Button>
              </DialogFooter>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
