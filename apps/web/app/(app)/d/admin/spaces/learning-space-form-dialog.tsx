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
  FieldTitle,
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
} from '@iconicedu/ui-web';
import { Textarea } from '@iconicedu/ui-web/ui/textarea';
import {
  DEFAULT_LEARNING_SPACE_ICON_KEY,
  LEARNING_SPACE_ICON_MAP,
  LEARNING_SPACE_ICON_OPTIONS,
  type LearningSpaceIconKey,
} from '@iconicedu/ui-web/lib/icons';

const KIND_OPTIONS = [
  { value: 'one_on_one', label: 'One on one' },
  { value: 'small_group', label: 'Small group' },
  { value: 'large_class', label: 'Large class' },
];

const SUBJECT_OPTIONS = ['MATH', 'SCIENCE', 'ELA', 'CHESS'];

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
  const [resourceLinks, setResourceLinks] = React.useState('');
  const SelectedIcon = LEARNING_SPACE_ICON_MAP[iconKey];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      <DialogContent className="w-[min(95vw,90rem)] sm:max-w-[min(95vw,90rem)] max-w-none overflow-hidden p-0">
        <div className="flex max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-border bg-card">
          <div className="px-6 py-5">
            <DialogHeader>
              <DialogTitle>Create learning space</DialogTitle>
              <DialogDescription>
                Fill out the basics, channels, and optional resources. This is a mock form
                until backend wiring is implemented.
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
                    Define the core details, subject, icon, and status for this learning
                    space.
                  </FieldDescription>
                  <FieldGroup className="grid gap-3 md:grid-cols-[auto_minmax(0,1fr)]">
                    <Field className="items-center gap-2">
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
                          className="flex rounded-2xl border border-border bg-muted py-2"
                        >
                          <div className="flex items-center">
                            <SelectValue placeholder="Select icon" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {LEARNING_SPACE_ICON_OPTIONS.map((option) => {
                              const Icon = LEARNING_SPACE_ICON_MAP[option.value];
                              return (
                                <SelectItem key={option.value} value={option.value}>
                                  <Icon className="size-4" aria-hidden />
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
                      />
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
                            {SUBJECT_OPTIONS.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
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
                            {KIND_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
                  <FieldLegend variant="label">Schedule & resources</FieldLegend>
                  <FieldDescription>
                    Configure the recurring schedule and attach helpful resources.
                  </FieldDescription>
                  <FieldGroup className="grid gap-3 md:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="ls-schedule">Schedule series</FieldLabel>
                      <Input
                        id="ls-schedule"
                        value={scheduleSeries}
                        onChange={(event) => setScheduleSeries(event.target.value)}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="ls-resources">Resource links</FieldLabel>
                      <Textarea
                        id="ls-resources"
                        value={resourceLinks}
                        onChange={(event) => setResourceLinks(event.target.value)}
                        rows={2}
                      />
                    </Field>
                  </FieldGroup>
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
