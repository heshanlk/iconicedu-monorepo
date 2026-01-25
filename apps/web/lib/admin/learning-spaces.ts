import { createSupabaseServerClient } from '../supabase/server';
import { ORG } from '../data/org';

export type LearningSpaceRow = {
  id: string;
  title: string;
  kind: string;
  status: string;
  subject?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getAdminLearningSpaceRows(): Promise<LearningSpaceRow[]> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from('learning_spaces')
    .select('id, title, kind, status, subject, description, created_at, updated_at')
    .eq('org_id', ORG.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (!data) {
    return [];
  }

  return data.map((space) => ({
    id: space.id,
    title: space.title,
    kind: space.kind,
    status: space.status,
    subject: space.subject,
    description: space.description,
    createdAt: space.created_at,
    updatedAt: space.updated_at,
  }));
}
