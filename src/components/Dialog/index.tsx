import { forwardRef, useImperativeHandle, useState } from "react";
import { XStack, YStack, styled, Dialog as TamDialog, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";

export interface DialogCompProps {
  title: React.ReactNode | string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  titleComponent?: React.ReactNode;
  SettingComponent?: React.ReactNode;
  onClose?: (status: boolean) => void;
  isShowClose?: boolean;
  isShowHeader?: boolean;
  direction?: "left" | "bottom" | "right" | "top";
}

export interface DialogRef {
  openDialog: () => void;
  closeDialog: () => void;
}

const DialogComp = forwardRef<DialogRef, DialogCompProps>(
  ({ title, children, trigger, onClose, isShowClose }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      openDialog: () => setIsOpen(true),
      closeDialog: () => setIsOpen(false),
    }));

    const handleChange = (status: boolean) => {
      setIsOpen(status);
      onClose?.(status);
    };

    return (
      <TamDialog open={isOpen} onOpenChange={handleChange}>
        {trigger && <TamDialog.Trigger>{trigger}</TamDialog.Trigger>}

        <TamDialog.Portal>
          <TamDialog.Overlay
            zIndex={999}
            backgroundColor="rgba(0,0,0,0.5)"
            onPress={() => handleChange(false)}
          />

          <TamDialog.Content
            borderRadius="$4"
            backgroundColor="$background"
            padding="$4"
            width="90%"
            maxWidth={400}
          >
            <XStack justifyContent="space-between" alignItems="center">
              <YStack>
                <TamDialog.Title>{title}</TamDialog.Title>
              </YStack>
              {isShowClose && (
                <TamDialog.Close onPress={() => handleChange(false)}>
                  <Ionicons name="close" size={24} color="#000" />
                </TamDialog.Close>
              )}
            </XStack>

            <YStack marginTop="$3">{children}</YStack>
          </TamDialog.Content>
        </TamDialog.Portal>
      </TamDialog>
    );
  },
);

export default DialogComp;
