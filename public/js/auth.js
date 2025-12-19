import { db } from "./firebase.js";
import {
  ref,
  push,
  get,
  set
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";
import { hashPassword } from "./hash.js";

const form = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const passwordHash = await hashPassword(password);

  const usersRef = ref(db, "users");
  const snapshot = await get(usersRef);

  let foundKey = null;
  snapshot.forEach(child => {
    if (child.val().email === email) {
      foundKey = child.key;
    }
  });

  // 🔐 ВХОД
  if (foundKey) {
    snapshot.forEach(child => {
      if (child.key === foundKey) {
        if (child.val().password === passwordHash) {
          localStorage.setItem("userId", foundKey);
          window.location.href = "dashboard.html";
        } else {
          message.textContent = "Неверный пароль";
        }
      }
    });
    return;
  }

  localStorage.setItem("userId", newUserRef.key);
  window.location.href = "dashboard.html";
});