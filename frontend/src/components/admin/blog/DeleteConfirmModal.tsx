import React from "react";
import { ConfirmModal } from "../../ConfirmModal";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

const DeleteConfirmModal: React.FC<Props> = ({
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  return (
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
      trigger={null}
    />
  );
};

export default DeleteConfirmModal;
