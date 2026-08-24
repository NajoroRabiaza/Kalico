import { useState, useRef } from "react";

/**
 * Hook qui encapsule la logique du panier avec la capacite d'annuler
 * une suppression pendant 5 secondes apres le clic.
 *
 * Principe :
 * 1. removeItem retire immediatement l'item du state visible (UX fluide)
 * 2. L'item est stocke dans pendingRemoval pendant 5 secondes
 * 3. Si undoRemoval est appele dans ce delai, l'item est reinserer
 * 4. Si le timer expire, pendingRemoval est efface — suppression definitive
 *
 * Le cart initial est passe en parametre pour que le hook reste
 * generique et non couple au CartContext.
 */
function useCartWithUndo(cart, setCart) {
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const timerRef = useRef(null);

  const removeItem = (_id) => {
    const item = cart.find((i) => i._id === _id);
    if (!item) return;

    clearTimeout(timerRef.current);

    setPendingRemoval(item);
    setCart((prev) => prev.filter((i) => i._id !== _id));

    timerRef.current = setTimeout(() => {
      setPendingRemoval(null);
    }, 5000);
  };

  const undoRemoval = () => {
    clearTimeout(timerRef.current);
    if (pendingRemoval) {
      setCart((prev) => [...prev, pendingRemoval]);
      setPendingRemoval(null);
    }
  };

  const dismissUndo = () => {
    clearTimeout(timerRef.current);
    setPendingRemoval(null);
  };

  return { removeItem, pendingRemoval, undoRemoval, dismissUndo };
}

export default useCartWithUndo;