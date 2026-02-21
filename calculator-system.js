let foodMaster =
    JSON.parse(localStorage.getItem("foodMaster")) || { ...defaultFoods };

let editingFoodName = null;

addFood();
renderSavedFoods();

function addFood() {
  const foods = document.getElementById("foods");
  const row = document.createElement("div");
  row.className = "food-row";

  const select = document.createElement("select");
  updateFoodOptions(select);

  const gram = document.createElement("input");
  gram.type = "number";
  gram.placeholder = "g";

  const cal = document.createElement("input");
  //cal.disabled = true;
  cal.placeholder = "cal"
  cal.className = "cal-display";

  const del = document.createElement("button");
  del.textContent = "×";
  del.className = "delete-btn";
  del.onclick = () => row.remove();

  gram.oninput = () => {
    cal.value = gram.value
      ? Math.round(gram.value * foodMaster[select.value])
      : "";
  };

    cal.oninput = () => {
    gram.value = cal.value
      ? Math.round(cal.value / foodMaster[select.value])
      : "";
  };

  row.append(select, gram, cal, del);
  foods.appendChild(row);
}

function updateFoodOptions(select) {
  select.innerHTML = "";
  Object.keys(foodMaster).forEach(food => {
    const option = document.createElement("option");
    option.value = food;
    option.textContent = food;
    select.appendChild(option);
  });
}

function toggleCustomFood() {
  const area = document.getElementById("customFoodArea");
  area.style.display = area.style.display === "none" ? "block" : "none";
  resetCustomForm();
}

function saveCustomFood() {
  const name = customName.value.trim();
  const gram = Number(customGram.value);
  const totalCal = Number(customTotalCal.value);

  if (!name || gram <= 0 || totalCal <= 0) {
    return;
  }

  const perGramCal = totalCal / gram;

  if (editingFoodName && editingFoodName !== name) {
    delete foodMaster[editingFoodName];
  }

  foodMaster[name] = perGramCal;
  localStorage.setItem("foodMaster", JSON.stringify(foodMaster));

  renderSavedFoods();
  document.querySelectorAll("select").forEach(updateFoodOptions);
  resetCustomForm();
}

function renderSavedFoods() {
  const list = document.getElementById("savedFoodList");
  list.innerHTML = "";

  Object.keys(foodMaster).forEach(food => {
    if (defaultFoods[food]) return;

    const div = document.createElement("div");
    div.className = "saved-food-item";

    const span = document.createElement("span");
    span.textContent = `${food} (${foodMaster[food].toFixed(2)} kcal/g)`;

    const actions = document.createElement("div");
    actions.className = "saved-food-actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "編集";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => editFood(food);

    const delBtn = document.createElement("button");
    delBtn.textContent = "削除";
    delBtn.className = "delete-btn";
    delBtn.onclick = () => {
      delete foodMaster[food];
      localStorage.setItem("foodMaster", JSON.stringify(foodMaster));
      renderSavedFoods();
      document.querySelectorAll("select").forEach(updateFoodOptions);
    };

    actions.append(editBtn, delBtn);
    div.append(span, actions);
    list.appendChild(div);
  });
}

function editFood(food) {
  const area = document.getElementById("customFoodArea");
  area.style.display = "block";

  editingFoodName = food;
  customTitle.textContent = "食材を編集";

  customName.value = food;
  customGram.value = "";
  customTotalCal.value = "";
}

function resetCustomForm() {
  editingFoodName = null;
  customTitle.textContent = "食材を追加";
  customName.value = "";
  customGram.value = "";
  customTotalCal.value = "";
}

function calculate() {
  const total = Number(totalCalories.value);
  let used = 0;

  document.querySelectorAll(".food-row").forEach(row => {
    used += Number(row.children[2].value || 0);
  });

  result.textContent = Math.round(total - used);
}