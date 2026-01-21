import type { Metadata } from 'next';

import { DashboardHeader } from '@iconicedu/ui-web';

import { createSupabaseServerClient } from '../../../../../lib/supabase/server';
import { ORG } from '../../../../../lib/data/org';
import { LearningSpacesTable, type LearningSpaceRow } from './spaces-table';

export const metadata: Metadata = {
  title: 'Admin · Learning spaces',
  description: 'Review and manage learning spaces, subjects, and visibility settings.',
};

type LearningSpaceRowRecord = {
  id: string;
  title: string;
  kind: LearningSpaceRow['kind'];
  status: string;
  subject?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
};

export default async function AdminLearningSpacesPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from<LearningSpaceRowRecord>('learning_spaces')
    .select('id, title, kind, status, subject, description, created_at, updated_at')
    .eq('org_id', ORG.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  const rows: LearningSpaceRow[] =
    data?.map((space) => ({
      id: space.id,
      title: space.title,
      kind: space.kind,
      status: space.status,
      subject: space.subject,
      description: space.description,
      createdAt: space.created_at,
      updatedAt: space.updated_at,
    })) ?? [];

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader title="Learning spaces" />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4">
          <LearningSpacesTable rows={rows} />
        </div>
      </div>
    </div>
  );
}
