import React, { createContext, useCallback, useContext, useState } from "react";
import { MessageDialogType, MessageDialog } from "../ui/MessageDialog/MessageDialog";

interface MessageDialogState {
  visible: boolean;
  type: MessageDialogType;
  title: string;
  message: string;
}

const initialState: MessageDialogState = {
  visible: false,
  type: "error",
  title: "",
  message: "",
};

interface MessageDialogContextValue {
  showErrorDialog: (title: string, message: string) => void;
  showSuccessDialog: (title: string, message: string) => void;
  hide: () => void;
}

const MessageDialogContext = createContext<MessageDialogContextValue | null>(
  null
);

export function MessageDialogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MessageDialogState>(initialState);

  const hide = useCallback(() => {
    setState(initialState);
  }, []);

  const showErrorDialog = useCallback((title: string, message: string) => {
    setState({
      visible: true,
      type: "error",
      title,
      message,
    });
  }, []);

  const showSuccessDialog = useCallback((title: string, message: string) => {
    setState({
      visible: true,
      type: "success",
      title,
      message,
    });
  }, []);

  const value: MessageDialogContextValue = {
    showErrorDialog,
    showSuccessDialog,
    hide,
  };

  return (
    <MessageDialogContext.Provider value={value}>
      {children}
      <MessageDialog
        visible={state.visible}
        type={state.type}
        title={state.title}
        message={state.message}
        onClose={hide}
      />
    </MessageDialogContext.Provider>
  );
}

export function useMessageDialog(): MessageDialogContextValue {
  const ctx = useContext(MessageDialogContext);
  if (!ctx) {
    throw new Error(
      "useMessageDialog must be used within a MessageDialogProvider"
    );
  }
  return ctx;
}
