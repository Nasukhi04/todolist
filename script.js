document.addEventListener("DOMContentLoaded", () => {

  /* DATA */

  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  let categories = JSON.parse(localStorage.getItem("categories")) || [
    { id: 1, name: "To Do",        color: "#4e73df", icon: "📌" },
    { id: 2, name: "In Progress",  color: "#f6c23e", icon: "🚀" },
    { id: 3, name: "Done",         color: "#1cc88a", icon: "✅" }
  ];

  let activeFilter = "all";
  let searchKeyword = "";

  /* NORMALISASI DATA LAMA (ANTI ERROR) */

  todos = todos.map(t => ({
    id: t.id,
    text: t.text,
    categoryId: t.categoryId,
    completed: t.completed || false,
    reaction: t.reaction || "",
    dueDate: t.dueDate || "",
    reminderMinutes: t.reminderMinutes ?? 60,
    notified: t.notified ?? false
  }));

  saveData();

  /*  NOTIFICATION  */

  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  function sendNotification(title, body) {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  }

  /* SAVE  */

  function saveData() {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("categories", JSON.stringify(categories));
  }

  /*  ELEMENT  */

  const board        = document.getElementById("board");
  const taskInput   = document.getElementById("task-input");
  const taskDate    = document.getElementById("task-date");
  const taskCategory= document.getElementById("task-category");

  /*  STATS  */

  function renderStats() {
    document.getElementById("stat-total").textContent = todos.length;
    document.getElementById("stat-done").textContent =
      todos.filter(t => t.completed).length;
    document.getElementById("stat-pending").textContent =
      todos.filter(t => !t.completed).length;
  }

  /*  DEADLINE CHECK  */

  function checkDeadlines() {
    const now = Date.now();

    todos.forEach(task => {
      if (task.completed || !task.dueDate || task.notified) return;

      const deadline = new Date(task.dueDate).getTime();
      const reminderTime = deadline - (task.reminderMinutes * 60000);

      if (now >= reminderTime) {
        sendNotification(
          "⏰ Reminder Task",
          `"${task.text}" akan deadline dalam ${task.reminderMinutes} menit`
        );
        task.notified = true;
        saveData();
      }
    });
  }

  /*  CATEGORIES  */

  function renderCategories() {
    taskCategory.innerHTML = "";
    const filterDiv = document.getElementById("category-filters");
    filterDiv.innerHTML = "";

     // ✅ tombol ALL
  const allBtn = document.createElement("button");
  allBtn.className = "filter-btn";
  if (activeFilter === "all") allBtn.classList.add("active");
  allBtn.textContent = "📋 All";

  allBtn.onclick = () => {
    activeFilter = "all";
    renderBoard();
    renderCategories();
  };

  filterDiv.appendChild(allBtn);

    categories.forEach(cat => {

      const opt = document.createElement("option");
      opt.value = cat.id;
      opt.textContent = `${cat.icon} ${cat.name}`;
      taskCategory.appendChild(opt);

      const btn = document.createElement("button");
      btn.className = "filter-btn";
      if (activeFilter == cat.id) btn.classList.add("active");

      btn.innerHTML = `
        ${cat.icon} ${cat.name}
        <span class="edit-cat">✏</span>
        <span class="delete-cat">✖</span>
      `;

      btn.onclick = (e) => {
        if (
          e.target.classList.contains("delete-cat") ||
          e.target.classList.contains("edit-cat")
        ) return;

        activeFilter = cat.id;
        renderBoard();
        renderCategories();
      };

      btn.querySelector(".edit-cat").onclick = (e) => {
        e.stopPropagation();
        const newName = prompt("Edit nama kategori:", cat.name);
        if (!newName) return;

        cat.name = newName.trim();
        saveData();
        renderCategories();
        renderBoard();
      };

      btn.querySelector(".delete-cat").onclick = (e) => {
        e.stopPropagation();
        if (!confirm("Hapus kategori & task di dalamnya?")) return;

        todos = todos.filter(t => t.categoryId != cat.id);
        categories = categories.filter(c => c.id != cat.id);
        activeFilter = "all";

        saveData();
        renderCategories();
        renderBoard();
      };

      filterDiv.appendChild(btn);
    });
  }

  /*  BOARD  */

  function renderBoard() {
    board.innerHTML = "";

    categories.forEach(cat => {
      const tasksFiltered = todos.filter(t =>
        t.categoryId == cat.id &&
        (activeFilter === "all" || activeFilter == cat.id) &&
        t.text.toLowerCase().includes(searchKeyword)
      );

      if (
        tasksFiltered.length === 0 &&
        activeFilter !== "all" &&
        activeFilter != cat.id
      ) return;

      const column = document.createElement("div");
      column.className = "column";

      column.innerHTML = `
        <div class="column-header">
          <div class="column-title">
            ${cat.icon} ${cat.name}
            <span class="task-count">${tasksFiltered.length}</span>
          </div>
        </div>
        <div class="task-list"></div>
      `;

      board.appendChild(column);
      const taskList = column.querySelector(".task-list");

      tasksFiltered.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task";
        if (task.completed) taskDiv.classList.add("completed");

        taskDiv.innerHTML = `
          <span>
            ${task.text}<br>
            <small>
              ⏰ ${
                task.dueDate
                  ? new Date(task.dueDate).toLocaleString("id-ID")
                  : "tanpa deadline"
              }
            </small><br>
            <small>🔔 ${task.reminderMinutes} menit sebelumnya</small>
            <span class="reaction">${task.reaction}</span>
          </span>
          <div class="task-actions">
            <button onclick="toggleTask(${task.id})">✔</button>
            <button onclick="editDeadline(${task.id})">⏰</button>
            <button onclick="pickEmoji(${task.id})">😊</button>
            <button onclick="deleteTask(${task.id})">🗑️</button>
          </div>
        `;

        taskList.appendChild(taskDiv);
      });
    });

    renderStats();
  }

  /*  TASK ACTION  */

  window.toggleTask = function (id) {
    const task = todos.find(t => t.id == id);
    if (task) {
      task.completed = !task.completed;
      saveData();
      renderBoard();
    }
  };

  window.deleteTask = function (id) {
    todos = todos.filter(t => t.id != id);
    saveData();
    renderBoard();
  };

  window.pickEmoji = function (id) {
    const task = todos.find(t => t.id == id);
    const emoji = prompt(
      "Masukkan emoji (pakai keyboard HP/PC):",
      task.reaction
    );

    if (emoji !== null) {
      task.reaction = emoji.trim();
      saveData();
      renderBoard();
    }
  };

  window.editDeadline = function (id) {
    const task = todos.find(t => t.id == id);
    if (!task) return;

    const newDate = prompt(
      "Masukkan deadline (YYYY-MM-DD HH:MM)",
      task.dueDate
        ? task.dueDate.replace("T", " ").slice(0, 16)
        : ""
    );

    if (newDate) {
      task.dueDate = newDate.replace(" ", "T");
      task.notified = false;
      saveData();
      renderBoard();
    }
  };

  /*  ADD TASK  */

  document.getElementById("add-task-btn").onclick = () => {
    if (!taskInput.value.trim()) {
      alert("Task tidak boleh kosong!");
      return;
    }

    if (!taskDate.value) {
      if (!confirm("Task tanpa deadline?")) return;
    }

    let reminder = prompt(
      "Ingatkan berapa menit sebelum deadline?\nContoh: 10, 30, 60, 1440",
      "60"
    );

    reminder = parseInt(reminder);
    if (isNaN(reminder) || reminder < 0) reminder = 60;

    todos.push({
      id: Date.now(),
      text: taskInput.value.trim(),
      categoryId: taskCategory.value,
      dueDate: taskDate.value,
      completed: false,
      reaction: "",
      reminderMinutes: reminder,
      notified: false
    });

    taskInput.value = "";
    taskDate.value = "";
    saveData();
    renderBoard();
  };

  /*  SEARCH & DARK  */

  document.getElementById("search").oninput = (e) => {
    searchKeyword = e.target.value.toLowerCase();
    renderBoard();
  };

  document.getElementById("dark-toggle").onchange = () => {
    document.body.classList.toggle("dark");
  };

  /*  INIT  */

  renderCategories();
  renderBoard();
  renderStats();

  /* CHECK DEADLINE SETIAP 30 DETIK */
  setInterval(checkDeadlines, 30000);

});
