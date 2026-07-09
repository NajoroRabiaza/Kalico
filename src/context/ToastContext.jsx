import { createContext, useContext, useState, useEffect } from "react";
import Toast from "../component/Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: "", type: "", show: false });

  // Cache le toast apres 4 secondes
  // Encapsule dans useEffect pour eviter de relancer le timer a chaque re-render
  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.show]);

  const showToast = (message, type = "success") => {
    setToast({ message, type, show: true });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
