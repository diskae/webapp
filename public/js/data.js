import { db } from "./firebase.js";
import { ref, onValue } from
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

const userId = localStorage.getItem("userId");
if (!userId) window.location.href = "auth.html";

const container = document.getElementById("cards");

onValue(ref(db, "tasks"), snapshot => {
  container.innerHTML = "";
  snapshot.forEach(child => {
    const task = child.val();
    if (task.userId !== userId) return;

    const card = document.createElement("div");
    card.className = "card";
    card.textContent = task.title;
    container.appendChild(card);
  });
});
