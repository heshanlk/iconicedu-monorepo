import * as React from 'react';
import { Briefcase } from 'lucide-react';

import type { StaffProfileSaveInput, StaffProfileVM } from '@iconicedu/shared-types';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Textarea } from '../../../ui/textarea';
import { UserSettingsTabSection } from './components/user-settings-tab-section';
import { Separator } from '../../../ui/separator';

type StaffProfileTabProps = {
  staffProfile: StaffProfileVM;
  onSave?: (input: StaffProfileSaveInput) => Promise<void> | void;
};

const listToTextarea = (values?: string[] | null) => (values ?? []).join(', ');

const textareaToList = (value: string) =>
  value
    .split(/[\n,]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

export function StaffProfileTab({ staffProfile, onSave }: StaffProfileTabProps) {
  const [workingHoursValue, setWorkingHoursValue] = React.useState(
    staffProfile.workingHoursRules?.[0] ?? '',
  );
  const [availabilityValue, setAvailabilityValue] = React.useState(
    listToTextarea(staffProfile.workingHoursRules?.slice(1) ?? []),
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    setWorkingHoursValue(staffProfile.workingHoursRules?.[0] ?? '');
    setAvailabilityValue(listToTextarea(staffProfile.workingHoursRules?.slice(1) ?? []));
  }, [staffProfile]);

  const handleSave = React.useCallback(async () => {
    if (!onSave) {
      return;
    }
    setErrorMessage(null);
    setIsSaving(true);
    try {
      await onSave({
        profileId: staffProfile.ids.id,
        orgId: staffProfile.ids.orgId,
        workingHoursRules: [
          ...(workingHoursValue ? [workingHoursValue.trim()] : []),
          ...textareaToList(availabilityValue),
        ],
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to save staff profile.',
      );
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [
    onSave,
    staffProfile.ids.id,
    staffProfile.ids.orgId,
    workingHoursValue,
    availabilityValue,
  ]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold">Staff profile</h3>
          <p className="text-sm text-muted-foreground">
            Department, role, and internal availability.
          </p>
        </div>
      </div>
      <Separator />
      <UserSettingsTabSection
        title="Availability & working rules"
        subtitle={
          workingHoursValue || availabilityValue
            ? workingHoursValue || availabilityValue
            : 'Share working hours or internal notes'
        }
        icon={<Briefcase className="h-5 w-5" />}
        showSeparator={false}
      >
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="settings-staff-working-hours">Working hours rules</Label>
            <Input
              id="settings-staff-working-hours"
              value={workingHoursValue}
              onChange={(event) => setWorkingHoursValue(event.target.value)}
              placeholder="9am to 5pm every day"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-staff-availability">Availability & working rules</Label>
            <Textarea
              id="settings-staff-availability"
              value={availabilityValue}
              onChange={(event) => setAvailabilityValue(event.target.value)}
              placeholder="Share additional working rules or availability notes (comma or newline separated)"
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
      </UserSettingsTabSection>

      {errorMessage ? (
        <p className="text-xs text-destructive">{errorMessage}</p>
      ) : null}
    </div>
  );
}
