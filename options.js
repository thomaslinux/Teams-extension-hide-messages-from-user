if (typeof browser === "undefined") {
  var browser = chrome;
}

const userListEl = document.getElementById("userList");
const toggleEl = document.getElementById("toggleEnable");
const newUserEl = document.getElementById("newUser");
const addBtn = document.getElementById("addBtn");

function renderList(users) {
  userListEl.innerHTML = "";
  (users || []).forEach((user) => {
    const li = document.createElement("li");

    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.checked = user.hidden;
    chk.onchange = () => toggleUser(user.name, chk.checked);

    const label = document.createElement("label");
    label.textContent = " " + user.name + " ";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => removeUser(user.name);

    li.appendChild(chk);
    li.appendChild(label);
    li.appendChild(removeBtn);
    userListEl.appendChild(li);
  });
}

async function loadSettings() {
  const { hideUsers = [], enabled = true } = await browser.storage.sync.get([
    "hideUsers",
    "enabled",
  ]);
  renderList(hideUsers);
  toggleEl.checked = enabled;
}

async function toggleUser(name, hidden) {
  const { hideUsers = [] } = await browser.storage.sync.get("hideUsers");
  const updated = hideUsers.map((u) =>
    u.name === name ? { ...u, hidden } : u,
  );
  await browser.storage.sync.set({ hideUsers: updated });
  renderList(updated);
}

async function removeUser(name) {
  const { hideUsers = [] } = await browser.storage.sync.get("hideUsers");
  const updated = hideUsers.filter((u) => u.name !== name);
  await browser.storage.sync.set({ hideUsers: updated });
  renderList(updated);
}

addBtn.onclick = async () => {
  const newUser = newUserEl.value.trim();
  if (!newUser) return;
  const { hideUsers = [] } = await browser.storage.sync.get("hideUsers");
  // Avoid duplicates
  if (hideUsers.some((u) => u.name === newUser)) {
    newUserEl.value = "";
    return;
  }
  const updated = [...hideUsers, { name: newUser, hidden: true }];
  await browser.storage.sync.set({ hideUsers: updated });
  renderList(updated);
  newUserEl.value = "";
};

toggleEl.onchange = async () => {
  await browser.storage.sync.set({ enabled: toggleEl.checked });
};

loadSettings();
