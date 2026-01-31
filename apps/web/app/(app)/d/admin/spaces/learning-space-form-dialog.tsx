'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

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
  RecurrenceScheduler,
} from '@iconicedu/ui-web';
import { Textarea } from '@iconicedu/ui-web/ui/textarea';
import {
  DEFAULT_LEARNING_SPACE_ICON_KEY,
  LEARNING_SPACE_ICON_MAP,
  LEARNING_SPACE_ICON_OPTIONS,
  type LearningSpaceIconKey,
} from '@iconicedu/ui-web/lib/icons';
import type { RecurrenceFormData } from '@iconicedu/ui-web/lib/recurrence-types';
import type { LearningSpaceLinkVM, UserProfileVM } from '@iconicedu/shared-types';
import type { LearningSpaceCreatePayload } from '@iconicedu/web/lib/admin/learning-space-create';

const KIND_OPTIONS = [
  { value: 'one_on_one', label: 'One on one' },
  { value: 'small_group', label: 'Small group' },
  { value: 'large_class', label: 'Large class' },
];

const SUBJECT_OPTIONS = ['MATH', 'SCIENCE', 'ELA', 'CHESS'];

type LearningSpaceFormDialogProps = {
  participantOptions?: UserProfileVM[];
};

export function LearningSpaceFormDialog({
  participantOptions = [],
}: LearningSpaceFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [kind, setKind] = React.useState(KIND_OPTIONS[0].value);
  const [title, setTitle] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [iconKey, setIconKey] = React.useState<LearningSpaceIconKey>(
    DEFAULT_LEARNING_SPACE_ICON_KEY,
  );
  const [participants, setParticipants] = React.useState<UserProfileVM[]>([]);
  const [resources, setResources] = React.useState<LearningSpaceLinkVM[]>([]);
  const [schedules, setSchedules] = React.useState<RecurrenceFormData[]>([]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const iconInvalid = isSubmitted && !iconKey;
  const titleInvalid = isSubmitted && !title.trim();
  const kindInvalid = isSubmitted && !kind;
  const participantsInvalid = isSubmitted && participants.length === 0;

  const resetForm = () => {
    setKind(KIND_OPTIONS[0].value);
    setTitle('');
    setSubject('');
    setDescription('');
    setIconKey(DEFAULT_LEARNING_SPACE_ICON_KEY);
    setParticipants([]);
    setResources([]);
    setSchedules([]);
    setIsSubmitted(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (!iconKey || !title.trim() || !kind || participants.length === 0) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const payload: LearningSpaceCreatePayload = {
      basics: {
        title: title.trim(),
        kind,
        iconKey,
        subject: subject || null,
        description: description.trim() || null,
      },
      participants: participants.map((participant) => ({
        profileId: participant.ids.id,
        kind: participant.kind,
        displayName: participant.profile.displayName,
        avatarUrl: participant.profile.avatar.url ?? null,
        themeKey: participant.ui?.themeKey ?? null,
      })),
      resources: resources.map((resource) => ({
        label: resource.label,
        iconKey: resource.iconKey ?? null,
        url: resource.url ?? null,
        status: resource.status ?? null,
        hidden: resource.hidden ?? null,
      })),
      schedules: schedules
        .filter((schedule) => schedule.startDate)
        .map((schedule) => ({
          startDate: schedule.startDate?.toISOString() ?? '',
          timezone: schedule.timezone,
          rule: schedule.rule,
          exceptions: schedule.exceptions,
          overrides: schedule.overrides,
        })),
    };

    setIsSaving(true);
    try {
      const response = await fetch('/d/admin/spaces/actions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !result.success) {
        toast.error(result.message ?? 'Unable to create learning space.');
        return;
      }
      toast.success('Learning space created.');
      setOpen(false);
      resetForm();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create learning space.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="flex items-center gap-2">
          <Plus className="size-4" />
          Add new
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[min(95vw,60rem)] sm:max-w-[min(95vw,60rem)] max-w-none overflow-hidden p-0">
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
                  <FieldLegend>Basics</FieldLegend>
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
                <FieldSet data-invalid={participantsInvalid}>
                  <FieldLegend>
                    Participants <span className="text-destructive">*</span>
                  </FieldLegend>
                  <FieldDescription>
                    Select families and educators with grouped chips for quick selection.
                  </FieldDescription>
                  <FieldGroup>
                    <ParticipantSelector
                      users={participantOptions}
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
                  {participantsInvalid && (
                    <FieldDescription className="text-destructive">
                      At least one participant is required.
                    </FieldDescription>
                  )}
                </FieldSet>
                <FieldSeparator />
                <FieldSet>
                  <FieldLegend>Schedule</FieldLegend>
                  <RecurrenceScheduler
                    className="max-w-none"
                    schedules={schedules}
                    onSchedulesChange={setSchedules}
                  />
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
                  disabled={isSaving}
                >
                  {isSaving ? 'Creating...' : 'Create space'}
                </Button>
              </DialogFooter>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
