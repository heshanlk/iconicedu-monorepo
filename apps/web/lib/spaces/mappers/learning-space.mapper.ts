import type { LearningSpaceDbRow } from '../queries/learning-spaces.query';

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

export function mapLearningSpaceRow(space: LearningSpaceDbRow): LearningSpaceRow {
  return {
    id: space.id,
    title: space.title,
    kind: space.kind,
    status: space.status,
    subject: space.subject,
    description: space.description,
    createdAt: space.created_at,
    updatedAt: space.updated_at,
  };
}
