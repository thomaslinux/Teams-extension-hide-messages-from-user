const userInput = document.getElementById("userInput");
const addBtn = document.getElementById("addUser");
const tableBody = document.querySelector("#usersTable tbody");
const hideEntireBox = document.getElementById("hideEntire");

function renderTable(users) {
  tableBody.innerHTML = "";
  users.forEach((u, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${u.name}</td>
      <td><input type="checkbox" class="enable" data-index="${i}" ${u.enabled ? "checked" : ""}></td>
      <td><button class="remove" data-index="${i}">X</button></td>`;
    tableBody.appendChild(row);
  });
}

function loadState() {
  browser.storage.local.get(
    ["hideUsersList", "hideEntireMessage"],
    ({ hideUsersList = [], hideEntireMessage = false }) => {
      renderTable(hideUsersList);
      hideEntireBox.checked = hideEntireMessage;
    },
  );
}

function saveUsers(users) {
  browser.storage.local.set({ hideUsersList: users });
}

function addUser() {
  const name = userInput.value.trim();
  if (!name) return;
  browser.storage.local.get("hideUsersList", ({ hideUsersList = [] }) => {
    hideUsersList.push({ name, enabled: true });
    saveUsers(hideUsersList);
    renderTable(hideUsersList);
  });
  userInput.value = "";
}

addBtn.addEventListener("click", addUser);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addUser();
});
hideEntireBox.addEventListener("change", (e) =>
  browser.storage.local.set({ hideEntireMessage: e.target.checked }),
);

tableBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove")) {
    const index = +e.target.dataset.index;
    browser.storage.local.get("hideUsersList", ({ hideUsersList = [] }) => {
      hideUsersList.splice(index, 1);
      saveUsers(hideUsersList);
      renderTable(hideUsersList);
    });
  }
});

tableBody.addEventListener("change", (e) => {
  if (e.target.classList.contains("enable")) {
    const index = +e.target.dataset.index;
    browser.storage.local.get("hideUsersList", ({ hideUsersList = [] }) => {
      hideUsersList[index].enabled = e.target.checked;
      saveUsers(hideUsersList);
    });
  }
});

document.addEventListener("DOMContentLoaded", loadState);
