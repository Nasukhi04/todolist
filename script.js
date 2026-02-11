document.addEventListener("DOMContentLoaded", () => {

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [
  {id:1,name:"To Do",color:"#4e73df",icon:"📌"},
  {id:2,name:"In Progress",color:"#f6c23e",icon:"🚀"},
  {id:3,name:"Done",color:"#1cc88a",icon:"✅"}
];

let activeFilter = "all";
let searchKeyword = "";

/* ================= SAVE ================= */
function saveData(){
  localStorage.setItem("todos",JSON.stringify(todos));
  localStorage.setItem("categories",JSON.stringify(categories));
}

/* ================= ELEMENT ================= */
const board = document.getElementById("board");
const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const taskCategory = document.getElementById("task-category");

/* ================= STATS ================= */
function renderStats(){
  document.getElementById("stat-total").textContent = todos.length;
  document.getElementById("stat-done").textContent = todos.filter(t=>t.completed).length;
  document.getElementById("stat-pending").textContent = todos.filter(t=>!t.completed).length;
}

/* ================= CATEGORIES ================= */
function renderCategories() {
  taskCategory.innerHTML = "";
  const filterDiv = document.getElementById("category-filters");
  filterDiv.innerHTML = "";

  /* ===== Tombol ALL ===== */
  const allBtn = document.createElement("button");
  allBtn.innerHTML = "📋 All";
  allBtn.className = "filter-btn";
  if (activeFilter === "all") allBtn.classList.add("active");

  allBtn.onclick = () => {
    activeFilter = "all";
    renderBoard();
    renderCategories();
  };

  filterDiv.appendChild(allBtn);

  /* ===== Render Semua Kategori ===== */
  categories.forEach(cat => {

    /* Dropdown */
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = `${cat.icon} ${cat.name}`;
    taskCategory.appendChild(opt);

    /* Filter Button */
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    if (activeFilter == cat.id) btn.classList.add("active");

    btn.innerHTML = `
      ${cat.icon} ${cat.name}
      <span class="delete-cat">✖</span>
    `;

    /* Klik Filter */
    btn.onclick = (e) => {
      if (e.target.classList.contains("delete-cat")) return;
      activeFilter = cat.id;
      renderBoard();
      renderCategories();
    };

    /* Hapus Kategori */
    btn.querySelector(".delete-cat").onclick = (e) => {
      e.stopPropagation();

      if (!confirm("Hapus kategori dan semua task di dalamnya?")) return;

      // hapus semua task kategori ini
      todos = todos.filter(t => t.categoryId != cat.id);

      // hapus kategori
      categories = categories.filter(c => c.id != cat.id);

      activeFilter = "all";

      saveData();
      renderCategories();
      renderBoard();
    };

    filterDiv.appendChild(btn);
  });
}


/* ================= BOARD ================= */
function renderBoard(){
  board.innerHTML="";
  renderStats();

  categories.forEach(cat=>{

    const column=document.createElement("div");
    column.className="column";

    const title=document.createElement("h3");
    title.innerHTML=`${cat.icon} ${cat.name}`;
    column.appendChild(title);

    // FILTER + SEARCH
    const catTodos = todos.filter(t=>
      (activeFilter==="all" || t.categoryId==activeFilter) &&
      t.categoryId==cat.id &&
      t.text.toLowerCase().includes(searchKeyword)
    );

    let doneCount=0;

    catTodos.forEach(todo=>{
      if(todo.completed) doneCount++;

      const card=document.createElement("div");
      card.className="card";
      if(todo.completed) card.classList.add("completed");
      card.draggable=true;
      card.style.borderLeft=`5px solid ${cat.color}`;

      card.innerHTML=`
        <div class="card-top">
          <input type="checkbox" ${todo.completed?"checked":""}>
          <span class="task-text">${todo.text}</span>
        </div>
        <small>${todo.dueDate || ""}</small>
        <button class="delete">🗑</button>
      `;

      // Checkbox
      card.querySelector("input").onchange=(e)=>{
        todo.completed=e.target.checked;
        saveData();
        renderBoard();
      };

      // Delete
      card.querySelector(".delete").onclick=()=>{
        todos=todos.filter(t=>t.id!==todo.id);
        saveData();
        renderBoard();
      };

      // Drag
      card.addEventListener("dragstart",e=>{
        e.dataTransfer.setData("id",todo.id);
      });

      column.appendChild(card);
    });

    // DROP AREA
    column.addEventListener("dragover",e=>e.preventDefault());
    column.addEventListener("drop",e=>{
      const id=e.dataTransfer.getData("id");
      const task=todos.find(t=>t.id==id);
      if(task){
        task.categoryId=cat.id;
        saveData();
        renderBoard();
      }
    });

    // PROGRESS BAR
    const progress=document.createElement("div");
    progress.className="progress";

    const bar=document.createElement("div");
    bar.className="progress-bar";
    bar.style.width=catTodos.length ? 
      (doneCount/catTodos.length*100)+"%" : "0%";
    bar.style.background=cat.color;

    progress.appendChild(bar);
    column.appendChild(progress);

    board.appendChild(column);
  });
}

/* ================= ADD TASK ================= */
document.getElementById("add-task-btn").onclick=()=>{
  if(!taskInput.value.trim()){
    alert("Task tidak boleh kosong!");
    return;
  }

  todos.push({
    id:Date.now(),
    text:taskInput.value.trim(),
    categoryId:taskCategory.value,
    dueDate:taskDate.value,
    completed:false
  });

  taskInput.value="";
  taskDate.value="";

  saveData();
  renderBoard();
};

/* ================= ADD CATEGORY ================= */
document.getElementById("add-cat-btn").onclick=()=>{
  const name=document.getElementById("cat-name").value.trim();
  const color=document.getElementById("cat-color").value;
  const icon=document.getElementById("cat-icon").value.trim() || "📂";

  if(!name){
    alert("Nama kategori kosong!");
    return;
  }

  categories.push({
    id:Date.now(),
    name,
    color,
    icon
  });

  document.getElementById("cat-name").value="";
  document.getElementById("cat-icon").value="";

  saveData();
  renderCategories();
  renderBoard();
};

/* ================= SEARCH ================= */
document.getElementById("search").oninput=(e)=>{
  searchKeyword=e.target.value.toLowerCase();
  renderBoard();
};

/* ================= DARK MODE ================= */
document.getElementById("dark-toggle").onchange=()=>{
  document.body.classList.toggle("dark");
};

/* ================= INIT ================= */
renderCategories();
renderBoard();

});
