const newUserInput = document.getElementById("newUser");
const addUserBtn = document.getElementById("addUser");
const usersTable = document.querySelector("#usersTable tbody");

let hideUsers = [];
let hideMode = "content";

function renderTable() {
  usersTable.innerHTML = "";
  hideUsers.forEach((u, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${u.name}</td>
      <td><input type="checkbox" data-index="${i}" ${u.enabled ? "checked" : ""}></td>
      <td><button data-remove="${i}">Remove</button></td>
    `;
    usersTable.appendChild(row);
  });
}

function save() {
  browser.storage.local.set({ hideUsers, hideMode });
}

addUserBtn.addEventListener("click", () => {
  const name = newUserInput.value.trim();
  if (name && !hideUsers.some((u) => u.name === name)) {
    hideUsers.push({ name, enabled: true });
    save();
    renderTable();
    newUserInput.value = "";
  }
});

newUserInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addUserBtn.click();
});

usersTable.addEventListener("change", (e) => {
  const idx = e.target.dataset.index;
  if (idx !== undefined) {
    hideUsers[idx].enabled = e.target.checked;
    save();
  }
});

usersTable.addEventListener("click", (e) => {
  const idx = e.target.dataset.remove;
  if (idx !== undefined) {
    hideUsers.splice(idx, 1);
    save();
    renderTable();
  }
});

document.querySelectorAll("input[name=mode]").forEach((r) => {
  r.addEventListener("change", () => {
    hideMode = r.value;
    save();
  });
});

browser.storage.local.get(["hideUsers", "hideMode"]).then((res) => {
  hideUsers = res.hideUsers || [];
  hideMode = res.hideMode || "content";
  document.querySelector(`input[value=${hideMode}]`).checked = true;
  renderTable();
});
