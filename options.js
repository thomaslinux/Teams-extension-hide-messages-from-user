const userInput = document.getElementById("userInput");
const addUserBtn = document.getElementById("addUser");
const userList = document.getElementById("userList");
const modeRadios = document.querySelectorAll('input[name="mode"]');

chrome.storage.sync.get(
  ["hideUsers", "hideMode"],
  ({ hideUsers = [], hideMode = "content" }) => {
    updateUI(hideUsers);
    setMode(hideMode);
  },
);

addUserBtn.addEventListener("click", addUser);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addUser();
});
modeRadios.forEach((r) => r.addEventListener("change", saveChanges));

function addUser() {
  const name = userInput.value.trim();
  if (!name) return;
  chrome.storage.sync.get(["hideUsers"], ({ hideUsers = [] }) => {
    hideUsers.push({ name, enabled: true });
    saveToStorage(hideUsers);
    userInput.value = "";
  });
}

function toggleUser(name) {
  chrome.storage.sync.get(["hideUsers"], ({ hideUsers = [] }) => {
    const updated = hideUsers.map((u) =>
      u.name === name ? { ...u, enabled: !u.enabled } : u,
    );
    saveToStorage(updated);
  });
}

function removeUser(name) {
  chrome.storage.sync.get(["hideUsers"], ({ hideUsers = [] }) => {
    const updated = hideUsers.filter((u) => u.name !== name);
    saveToStorage(updated);
  });
}

function setMode(mode) {
  document.querySelector(`input[value="${mode}"]`).checked = true;
}

function saveToStorage(hideUsers) {
  const hideMode = document.querySelector('input[name="mode"]:checked').value;
  chrome.storage.sync.set({ hideUsers, hideMode });
  updateUI(hideUsers);
  updateContentScript(hideUsers, hideMode);
}

function updateUI(hideUsers) {
  userList.innerHTML = "";
  hideUsers.forEach(({ name, enabled }) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <label>
        <input type="checkbox" ${enabled ? "checked" : ""} />
        ${name}
      </label>
      <button class="remove">x</button>
    `;
    li.querySelector("input").addEventListener("change", () =>
      toggleUser(name),
    );
    li.querySelector(".remove").addEventListener("click", () =>
      removeUser(name),
    );
    userList.appendChild(li);
  });
}

function saveChanges() {
  chrome.storage.sync.get(
    ["hideUsers", "hideMode"],
    ({ hideUsers = [], hideMode = "content" }) => {
      const newMode = document.querySelector(
        'input[name="mode"]:checked',
      ).value;
      saveToStorage(hideUsers, newMode);
    },
  );
}

function updateContentScript(hideUsers, hideMode) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "updateHideList",
        hideUsers,
        hideMode,
      });
    }
  });
}
