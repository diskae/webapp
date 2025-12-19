import { db } from "./firebase.js";
import {
  ref,
  push,
  get,
  set
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";
import { hashPassword } from "./hash.js";

const form = document.getElementById("authForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const passwordHash = await hashPassword(password);

  let nameValue = name.length;
  if (nameValue == 0) {
    message.textContent = "Пустое имя"; return;
  }

  let passValue = password.length;
  if (passValue <= 5) {
    message.textContent = "Минимальная длина пароля 6"; return;
  }

  function validateEmail(email) {
  // Стандартное RegEx для проверки email (соответствует RFC 5322)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email); // Возвращает true/false
}

  if (!validateEmail(email)) {
  message.textContent = "Некорректный email"; return;
}

  const usersRef = ref(db, "users");
  const snapshot = await get(usersRef);

  let foundKey = null;
  snapshot.forEach(child => {
    if (child.val().email === email) {
      foundKey = child.key;
    }
  });

  // 🆕 РЕГИСТРАЦИЯ
  const newUserRef = push(usersRef);
  await set(newUserRef, {
    name,
    email,
    password: passwordHash,
    createdAt: Date.now()
  });

  localStorage.setItem("userId", newUserRef.key);
  window.location.href = "dashboard.html";
});