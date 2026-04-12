import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
  const token = localStorage.getItem("CommerceToken");

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("CommerceToken");
      return null;
    }

    return decoded;
  } catch {
    localStorage.removeItem("CommerceToken");
    return null;
  }
};