'use client';

import * as React from 'react';

export type Student = {
  id: number;
  name: string;
};

type SectionKey = 'favorites' | 'classrooms';

type StudentFilterContextValue = {
  students: Student[];
  selectedStudentBySection: Record<SectionKey, number | null>;
  setSelectedStudent: (section: SectionKey, studentId: number | null) => void;
};

const StudentFilterContext = React.createContext<StudentFilterContextValue | null>(null);

export function StudentFilterProvider({
  students,
  children,
}: {
  students: Student[];
  children: React.ReactNode;
}) {
  const [selectedStudentBySection, setSelectedStudentBySection] = React.useState<
    Record<SectionKey, number | null>
  >({
    favorites: null,
    classrooms: null,
  });

  const setSelectedStudent = React.useCallback(
    (section: SectionKey, studentId: number | null) => {
      setSelectedStudentBySection((prev) => ({
        ...prev,
        [section]: studentId,
      }));
    },
    [],
  );

  const value = React.useMemo(
    () => ({
      students,
      selectedStudentBySection,
      setSelectedStudent,
    }),
    [students, selectedStudentBySection, setSelectedStudent],
  );

  return (
    <StudentFilterContext.Provider value={value}>
      {children}
    </StudentFilterContext.Provider>
  );
}

export function useStudentFilter() {
  const context = React.useContext(StudentFilterContext);
  if (!context) {
    throw new Error('useStudentFilter must be used within StudentFilterProvider.');
  }
  return context;
}
