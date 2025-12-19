import { db } from "./firebase.js";
import { ref, push, onValue, remove } from
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

const userId = localStorage.getItem("userId");
if (!userId) window.location.href = "auth.html";

const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const taskList = document.getElementById("taskList");

taskForm.addEventListener("submit", e => {
  e.preventDefault();

  push(ref(db, "tasks"), {
    title: titleInput.value,
    userId,
    createdAt: Date.now()
  });

  taskForm.reset();
});

onValue(ref(db, "tasks"), snapshot => {
  taskList.innerHTML = "";
  snapshot.forEach(child => {
    const task = child.val();
    if (task.userId !== userId) return;

    const li = document.createElement("li");
    li.textContent = task.title;
    li.onclick = () => remove(child.ref);
    taskList.appendChild(li);
  });

  const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("userId");
    window.location.href = "auth.html";
  });
}

});
