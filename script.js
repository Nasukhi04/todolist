/* ROOT VARIABLES (LIGHT MODE) */
:root {
  --bg-main: #f4f6fb;
  --bg-card: #ffffff;
  --text-main: #1e293b;
  --text-secondary: #64748b;
  --accent: #6366f1;
  --border: #e2e8f0;
}

/* DARK MODE VARIABLES                                   */
body.dark {
  --bg-main: #0f172a;
  --bg-card: #1e293b;
  --text-main: #f1f5f9;
  --text-secondary: #94a3b8;
  --accent: #818cf8;
  --border: #334155;
}

/* GLOBAL RESET & BASE */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Segoe UI", sans-serif;
  background: var(--bg-main);
  color: var(--text-main);
  transition: background 0.3s, color 0.3s;
}

/* HEADER                                                 */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: linear-gradient(135deg, #6366f1, #818cf8);
  color: #fff;
}

header h1 {
  margin: 0;
  font-size: 26px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* SEARCH INPUT */
#search {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  outline: none;
}

/* DARK MODE SWITCH */
.switch {
  position: relative;
  width: 50px;
  height: 24px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  inset: 0;
  background: #cbd5f5;
  border-radius: 24px;
  cursor: pointer;
  transition: 0.4s;
}

.slider::before {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  left: 3px;
  bottom: 3px;
  transition: 0.4s;
}

input:checked + .slider {
  background: var(--accent);
}

input:checked + .slider::before {
  transform: translateX(26px);
}

/* MAIN CONTAINER */
.container {
  max-width: 1100px;
  margin: 30px auto;
  padding: 35px 40px;
  background: var(--bg-card);
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow: 0 15px 35px rgba(0,0,0,0.08);
}

/* STATISTICS */
.stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  font-weight: 600;
  margin-bottom: 35px;
}

/* SECTION HEADERS */
.section-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 25px 0 15px;
  text-align: center;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
}

/* FORM LAYOUTS */
.add-task,
.add-category {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.add-task input,
.add-task select,
.add-category input {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-main);
  min-width: 180px;
}

/* BUTTONS */
button {
  border: none;
  cursor: pointer;
  border-radius: 10px;
  padding: 10px 20px;
}

#add-task-btn,
#add-cat-btn {
  background: var(--accent);
  color: #fff;
}

#add-task-btn:hover,
#add-cat-btn:hover {
  opacity: 0.9;
}

/* FILTER BUTTONS */
.filters {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.filter-btn {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: transparent;
  cursor: pointer;
  transition: 0.3s;
}

.filter-btn.active,
.filter-btn:hover {
  background: var(--accent);
  color: #fff;
  border-color: transparent;
}

/* BOARD */
#board {
  position: relative;
  margin-top: 25px;
  padding-top: 20px;
}

/* CATEGORY & STAT TITLES */
#board::before {
  content: "📂 Category List";
  display: block;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  margin: 10px 0 25px;
  letter-spacing: 0.5px;
  color: var(--text-main);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}

#board::after {
  content: "📊 Statistik Tugas";
  display: block;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  margin: 45px 0 20px;
  letter-spacing: 0.5px;
  color: var(--text-main);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}

/* TASK LIST */
.task-list {
  margin-top: 25px;
}

/* TASK ITEM */
.task {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  margin-bottom: 12px;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.12),
    rgba(99, 102, 241, 0.05)
  );
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: 0.2s ease;
}

.task:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.12);
}

.task span {
  flex: 1;
}

.task.completed {
  opacity: 0.6;
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.15),
    rgba(34, 197, 94, 0.05)
  );
  border-color: rgba(34, 197, 94, 0.4);
}

.task.completed span {
  text-decoration: line-through;
}

/* TASK ACTIONS */
.task-actions {
  display: flex;
  gap: 12px;
}

.task-actions button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

/* DARK MODE TASK */
body.dark .task {
  background: linear-gradient(
    135deg,
    rgba(129, 140, 248, 0.18),
    rgba(30, 41, 59, 0.95)
  );
  border: 1px solid #334155;
}

/* REMOVE INNER CARD STYLES */
.card-section,
.column {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
  margin: 0;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  header {
    flex-direction: column;
    gap: 15px;
  }

  .stats {
    flex-direction: column;
    gap: 10px;
  }

  .container {
    padding: 25px 18px;
    margin: 20px 12px;
  }

  .add-task input,
  .add-category input {
    min-width: 100%;
  }
}
