// Wrapper autour de fetch qui injecte automatiquement le token JWT
// dans le header Authorization de chaque requete vers le backend
// Utilise partout ou la route backend exige un utilisateur connecte
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  // Ne pas poser Content-Type si le body est un FormData
  // Le navigateur le gere lui-meme avec le boundary multipart correct
  // Poser application/json dans ce cas ecrase le Content-Type et casse multer
  const isFormData = options.body instanceof FormData;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("userLevel");
    localStorage.removeItem("userName");
    window.dispatchEvent(new Event("auth:expire"));
  }

  return response;
};

export default authFetch;
