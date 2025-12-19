export function setSession(userId) {
  localStorage.setItem("userId", userId);
}

export function getSession() {
  return localStorage.getItem("userId");
}

export function clearSession() {
  localStorage.removeItem("userId");
}