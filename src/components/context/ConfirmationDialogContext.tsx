import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import {
  ConfirmDialog,
  ConfirmationVariant,
} from '../ui/ConfirmDialog/ConfirmDialog';

export interface ShowConfirmOptions {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmationVariant;
  icon?:
    | 'question-circle'
    | 'exclamation-triangle'
    | 'info-circle'
    | 'trash-alt';
}

interface ConfirmationDialogState {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  variant: ConfirmationVariant;
  icon: ShowConfirmOptions['icon'];
}

const initialState: ConfirmationDialogState = {
  visible: false,
  title: '',
  message: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  variant: 'primary',
  icon: 'question-circle',
};

interface ConfirmationDialogContextValue {
  showConfirm: (options: ShowConfirmOptions) => void;
  hide: () => void;
}

const ConfirmationDialogContext =
  createContext<ConfirmationDialogContextValue | null>(null);

export function ConfirmationDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<ConfirmationDialogState>(initialState);
  const onConfirmRef = useRef<() => void>(() => {});
  const onCancelRef = useRef<(() => void) | undefined>(undefined);

  const hide = useCallback(() => {
    setState(initialState);
    onConfirmRef.current = () => {};
    onCancelRef.current = undefined;
  }, []);

  const showConfirm = useCallback((options: ShowConfirmOptions) => {
    const {
      title,
      message,
      onConfirm,
      onCancel,
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      variant = 'primary',
      icon = 'question-circle',
    } = options;
    onConfirmRef.current = onConfirm;
    onCancelRef.current = onCancel;
    setState({
      visible: true,
      title,
      message,
      confirmLabel,
      cancelLabel,
      variant,
      icon,
    });
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirmRef.current?.();
    hide();
  }, [hide]);

  const handleCancel = useCallback(() => {
    onCancelRef.current?.();
    hide();
  }, [hide]);

  const value: ConfirmationDialogContextValue = {
    showConfirm,
    hide,
  };

  return (
    <ConfirmationDialogContext.Provider value={value}>
      {children}
      <ConfirmDialog
        visible={state.visible}
        title={state.title}
        message={state.message}
        confirmLabel={state.confirmLabel}
        cancelLabel={state.cancelLabel}
        variant={state.variant}
        icon={state.icon}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmationDialogContext.Provider>
  );
}

export function useConfirmationDialog(): ConfirmationDialogContextValue {
  const ctx = useContext(ConfirmationDialogContext);
  if (!ctx) {
    throw new Error(
      'useConfirmationDialog must be used within a ConfirmationDialogProvider',
    );
  }
  return ctx;
}
