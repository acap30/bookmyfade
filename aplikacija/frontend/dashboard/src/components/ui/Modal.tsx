import type { ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  children: ReactNode;
};

const Modal = ({ open, title, children }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-center">
          <h2 className="text-lg font-semibold text-text">{title}</h2>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;
