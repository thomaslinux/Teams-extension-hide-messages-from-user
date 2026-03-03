const userListEl = document.getElementById("userList");
const toggleEl = document.getElementById("toggleEnable");
const newUserEl = document.getElementById("newUser");
const addBtn = document.getElementById("addBtn");

function renderList(users) {
  userListEl.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user + " ";
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => removeUser(user);
    li.appendChild(removeBtn);
    userListEl.appendChild(li);
  });
}

function loadSettings() {
  chrome.storage.sync.get(
    ["hideUsers", "enabled"],
    ({ hideUsers, enabled }) => {
      renderList(hideUsers || []);
      toggleEl.checked = enabled ?? true;
    },
  );
}

function removeUser(user) {
  chrome.storage.sync.get("hideUsers", ({ hideUsers }) => {
    const updated = hideUsers.filter((u) => u !== user);
    chrome.storage.sync.set({ hideUsers: updated });
    renderList(updated);
  });
}

addBtn.onclick = () => {
  const newUser = newUserEl.value.trim();
  if (!newUser) return;
  chrome.storage.sync.get("hideUsers", ({ hideUsers }) => {
    const updated = [...(hideUsers || []), newUser];
    chrome.storage.sync.set({ hideUsers: updated });
    renderList(updated);
    newUserEl.value = "";
  });
};

toggleEl.onchange = () => {
  chrome.storage.sync.set({ enabled: toggleEl.checked });
};

loadSettings();
