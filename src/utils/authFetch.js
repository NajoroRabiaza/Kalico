// Wrapper autour de fetch qui injecte automatiquement le token JWT
// dans le header Authorization de chaque requete vers le backend
// Utilise partout ou la route backend exige un utilisateur connecte

const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      // Le format "Bearer <token>" est la convention standard pour JWT
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Si le backend retourne 401 ou 403, le token est expire ou invalide
  // On nettoie le localStorage et on emet un evenement global pour
  // notifier App.jsx sans coupler authFetch au state React
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("userLevel");
    localStorage.removeItem("userName");
    window.dispatchEvent(new Event("auth:expire"));
  }

  return response;
};

export default authFetch;