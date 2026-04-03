import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: "", type: "", show: false });

  const showToast = (message, type = "success") => {
    setToast({ message, type, show: true });
    setTimeout(() => setToast({ ...toast, show: false }), 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

import Toast from "../component/Toast";
