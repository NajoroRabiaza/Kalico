import { createContext, useEffect, useRef, useState } from "react";
import { useToast } from "../context/ToastContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("mon_panier");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orderHistory, setOrderHistory] = useState(() => {
    const saved = localStorage.getItem("historique_commandes");
    if (!saved) return [];
    return JSON.parse(saved).map((cmd) =>
      cmd.status ? cmd : { ...cmd, status: "en attente" }
    );
  });

  const { showToast } = useToast();

  // On utilise une ref pour lire orderHistory dans l'interval sans en faire une dependance
  // Si on mettait orderHistory dans les deps du useEffect, chaque setOrderHistory
  // redeclencherait l'effet, creant une boucle infinie quand une commande expire
  const orderHistoryRef = useRef(orderHistory);
  useEffect(() => {
    orderHistoryRef.current = orderHistory;
  }, [orderHistory]);

  // Verifie toutes les 60 secondes si des commandes Cash ont expirer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updated = orderHistoryRef.current.filter((cmd) => {
        if (cmd.methodePaiement === "Cash") {
          const elapsed = (now - new Date(cmd.date)) / 1000;
          if (elapsed >= 600) {
            showToast("Commande expiree apres 10mn !", "alert");
            return false;
          }
        }
        return true;
      });

      if (updated.length !== orderHistoryRef.current.length) {
        setOrderHistory(updated);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem("mon_panier", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("historique_commandes", JSON.stringify(orderHistory));
  }, [orderHistory]);

  const handleClick = (item, toastFn) => {
    const existItem = cart.find((produit) => produit._id === item._id);
    if (existItem) {
      setCart(cart.map((produit) =>
        produit._id === item._id
          ? { ...produit, quantity: produit.quantity + item.quantity }
          : produit
      ));
    } else {
      setCart([...cart, { ...item, quantity: item.quantity || 1 }]);
    }
    if (toastFn) toastFn("Produit ajoute", "success");
  };

  return (
    <CartContext.Provider
      value={{ cart, setCart, handleClick, orderHistory, setOrderHistory }}
    >
      {children}
    </CartContext.Provider>
  );
}