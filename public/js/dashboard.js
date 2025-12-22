import { db } from "./firebase.js";
import { ref, push, onValue, remove, update } from
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

const userId = localStorage.getItem("userId");
if (!userId) window.location.href = "auth.html";

const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const taskList = document.getElementById("taskList");

// Выход
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("userId");
    window.location.href = "auth.html";
  });
}

// Добавить задачу
taskForm.addEventListener("submit", e => {
  e.preventDefault();
  push(ref(db, "tasks"), {
    title: titleInput.value,
    userId,
    createdAt: Date.now()
  });
  titleInput.value = "";
});

// Показать задачи
onValue(ref(db, "tasks"), snapshot => {
  taskList.innerHTML = "";
  
  snapshot.forEach(child => {
    const task = child.val();
    if (task.userId !== userId) return;

    const li = document.createElement("li");
    
    // Текст задачи
    const span = document.createElement("span");
    span.textContent = task.title;
    
    // Кнопка удаления
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить";
    deleteBtn.onclick = () => remove(ref(db, `tasks/${child.key}`));
    
    // Кнопка редактирования
    const editBtn = document.createElement("button");
    editBtn.textContent = "Ред.";
    
    // Режим редактирования
    editBtn.onclick = () => {
      const newText = prompt("Новый текст:", task.title);
      if (newText && newText !== task.title) {
        update(ref(db, `tasks/${child.key}`), { title: newText });
      }
    };
    
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
});
