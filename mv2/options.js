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

const bgUrlInput = document.getElementById("newBgUrl");
const addBgUrlBtn = document.getElementById("addBgUrl");
const bgTable = document.querySelector("#bgTable tbody");

let backgrounds = []; // [{url:"https://...", active:true}, ...]

function renderBgTable() {
  const container = document.getElementById("restoreDefaultsContainer");
  bgTable.innerHTML = "";
  container.innerHTML = "";

  if (!backgrounds.length) {
    const btn = document.createElement("button");
    btn.textContent = "Restore Default Backgrounds";
    btn.addEventListener("click", () => {
      backgrounds = JSON.parse(JSON.stringify(DEFAULT_BACKGROUNDS));
      browser.storage.local.set({ backgrounds }).then(renderBgTable);
    });
    container.appendChild(btn);
    return;
  }

  backgrounds.forEach((bg, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="radio" name="bgSelect" data-index="${i}" ${bg.active ? "checked" : ""}></td>
      <td style="word-break: break-all;">${bg.url}</td>
      <td><button data-remove="${i}">Remove</button></td>
    `;
    bgTable.appendChild(row);
  });
}

function saveBackgrounds() {
  browser.storage.local.set({ backgrounds });
}

addBgUrlBtn.addEventListener("click", () => {
  const url = bgUrlInput.value.trim();
  if (url && !backgrounds.some((b) => b.url === url)) {
    backgrounds.push({ url, active: false });
    saveBackgrounds();
    renderBgTable();
    bgUrlInput.value = "";
  }
});

bgUrlInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addBgUrlBtn.click();
});

bgTable.addEventListener("click", (e) => {
  const idx = e.target.dataset.remove;
  if (idx !== undefined) {
    backgrounds.splice(idx, 1);
    saveBackgrounds();
    renderBgTable();
  }
});

bgTable.addEventListener("change", (e) => {
  const idx = e.target.dataset.index;
  if (idx !== undefined) {
    backgrounds.forEach((b, i) => (b.active = i == idx));
    saveBackgrounds();
  }
});

// Include backgrounds in your initial load
browser.storage.local
  .get(["hideUsers", "hideMode", "myMessagesMode", "backgrounds"])
  .then((res) => {
    hideUsers = res.hideUsers || [];
    hideMode = res.hideMode || "content";
    myMessagesMode = res.myMessagesMode || "none";
    backgrounds = res.backgrounds || [];
    renderTable();
    renderBgTable();
    const mode = res.myMessagesMode || "none";
    document.querySelector(
      `input[name='myMessagesMode'][value='${mode}']`,
    ).checked = true;
  });

const myMessagesRadios = document.querySelectorAll(
  "input[name='myMessagesMode']",
);

myMessagesRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    browser.storage.local.set({ myMessagesMode: radio.value });
  });
});

// Load settings at startup
browser.storage.local
  .get(["hideUsers", "hideMode", "myMessagesMode", "bgUrl"])
  .then((res) => {
    hideUsers = res.hideUsers || [];
    hideMode = res.hideMode || "content";
    const mode = res.myMessagesMode || "none";
    document.querySelector(
      `input[name='myMessagesMode'][value='${mode}']`,
    ).checked = true;

    bgUrlInput.value = res.bgUrl || "";
    renderTable();
  });
