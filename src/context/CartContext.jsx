import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const orderHistoryRef = useRef(orderHistory);
  useEffect(() => {
    orderHistoryRef.current = orderHistory;
  }, [orderHistory]);

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

  // useCallback evite de recreer handleClick a chaque rendu
  // cart est en dependance car la fonction lit cart pour detecter un produit existant
  // sans cart dans les deps, la closure serait perimee et le panier ne se mettrait plus a jour
  const handleClick = useCallback((item, toastFn) => {
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
  }, [cart]);

  // useMemo evite de creer un nouvel objet value a chaque rendu
  // sans cela, tous les consommateurs du contexte se re-rendent meme si cart n'a pas change
  const value = useMemo(() => ({
    cart,
    setCart,
    handleClick,
    orderHistory,
    setOrderHistory,
  }), [cart, handleClick, orderHistory]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
