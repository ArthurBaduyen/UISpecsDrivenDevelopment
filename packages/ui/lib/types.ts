import type { ReactNode } from 'react';

export type UiAction = {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
};

export type UiOption = {
  label: string;
  value: string;
};
