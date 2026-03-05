import type { ReactNode } from 'react';
import { Section } from './section';

type ContentSectionProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function ContentSection(props: ContentSectionProps) {
  return <Section {...props} />;
}
