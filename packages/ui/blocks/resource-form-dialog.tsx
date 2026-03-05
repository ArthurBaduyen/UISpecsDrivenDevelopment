'use client';

import type { FormEventHandler, ReactNode } from 'react';
import { Button } from '../primitives/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../primitives/dialog';

type ResourceFormDialogProps = {
  trigger: ReactNode;
  title: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  submitLabel?: string;
  cancelLabel?: string;
  children: ReactNode;
};

export function ResourceFormDialog({
  trigger,
  title,
  description,
  open,
  onOpenChange,
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  children
}: ResourceFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <form className="mt-4 space-y-4" onSubmit={onSubmit}>
          {children}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
              {cancelLabel}
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
