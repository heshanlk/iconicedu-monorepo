import * as React from 'react';

type SequentialHighlightConfig<T extends string> = {
  order: T[];
  satisfied: Record<T, boolean>;
  enabled?: boolean;
};

export function useSequentialHighlight<T extends string>({
  order,
  satisfied,
  enabled = true,
}: SequentialHighlightConfig<T>) {
  const [currentField, setCurrentField] = React.useState<T | null>(() => {
    if (!enabled) {
      return null;
    }
    return order.find((key) => !satisfied[key]) ?? null;
  });

  React.useEffect(() => {
    if (!enabled) {
      setCurrentField(null);
      return;
    }

    const nextField = order.find((key) => !satisfied[key]) ?? null;
    setCurrentField(nextField);
  }, [enabled, order, satisfied]);

  const isActive = React.useCallback(
    (field: T) => enabled && currentField === field,
    [currentField, enabled],
  );

  return { currentField, isActive };
}
