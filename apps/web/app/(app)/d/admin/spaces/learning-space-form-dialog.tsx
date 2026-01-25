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
} from '@iconicedu/ui-web';
import { Textarea } from '@iconicedu/ui-web/ui/textarea';
import {
  DEFAULT_LEARNING_SPACE_ICON_KEY,
  LEARNING_SPACE_ICON_MAP,
  LEARNING_SPACE_ICON_OPTIONS,
  type LearningSpaceIconKey,
} from '@iconicedu/ui-web/lib/icons';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@iconicedu/ui-web/ui/combobox';
import type { LearningSpaceLinkVM } from '@iconicedu/shared-types';

const KIND_OPTIONS = [
  { value: 'one_on_one', label: 'One on one' },
  { value: 'small_group', label: 'Small group' },
  { value: 'large_class', label: 'Large class' },
];

const SUBJECT_OPTIONS = ['MATH', 'SCIENCE', 'ELA', 'CHESS'];

const PARTICIPANT_GROUPS = [
  {
    label: 'Parents',
    items: ['Alex Vega (parent of Mateo)', 'Jordan Rivera (parent of Leila)'],
  },
  {
    label: 'Kids',
    items: ['Mateo Vega', 'Leila Rivera', 'Sienna Park'],
  },
  {
    label: 'Educators',
    items: ['Sophie Lee', 'Noel Patel', 'Imani Brooks'],
  },
] as const;

const PARTICIPANT_ITEMS = PARTICIPANT_GROUPS.flatMap((group) => group.items);

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
  const [participants, setParticipants] = React.useState<string[]>([]);
  const [resources, setResources] = React.useState<LearningSpaceLinkVM[]>([]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const anchor = useComboboxAnchor();
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
                          className="flex items-center justify-center rounded-full border border-border bg-muted"
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
                      <FieldDescription
                        className={
                          kindInvalid ? 'text-destructive' : 'text-muted-foreground'
                        }
                      >
                        {kindInvalid
                          ? 'Kind is required for the learning space.'
                          : 'Choose how the learning experience is structured.'}
                      </FieldDescription>
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
                    <Combobox
                      multiple
                      items={PARTICIPANT_ITEMS}
                      value={participants}
                      onValueChange={setParticipants}
                    >
                      <ComboboxChips ref={anchor} className="w-full">
                        <ComboboxValue>
                          {(values) => (
                            <>
                              {values.map((value) => (
                                <ComboboxChip key={value}>{value}</ComboboxChip>
                              ))}
                              <ComboboxChipsInput placeholder="Search participants" />
                            </>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>
                      <ComboboxContent anchor={anchor}>
                        <ComboboxEmpty>No participants found.</ComboboxEmpty>
                        <ComboboxList>
                          {PARTICIPANT_GROUPS.map((group) => (
                            <ComboboxGroup key={group.label}>
                              <ComboboxLabel>{group.label}</ComboboxLabel>
                              {group.items.map((item) => (
                                <ComboboxItem key={item} value={item}>
                                  {item}
                                </ComboboxItem>
                              ))}
                            </ComboboxGroup>
                          ))}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
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
