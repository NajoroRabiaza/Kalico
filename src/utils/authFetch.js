// Wrapper autour de fetch qui injecte automatiquement le token JWT
// dans le header Authorization de chaque requete vers le backend
// Utilise partout ou la route backend exige un utilisateur connecte

const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      // Le format "Bearer <token>" est la convention standard pour JWT
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
};

export default authFetch;
