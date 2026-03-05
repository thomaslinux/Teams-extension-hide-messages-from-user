// Manages options UI and stores settings in chrome.storage.sync

const DEFAULT_BG_URLS = [
  "none",
  "https://unsplash.com/photos/PZMeVJwCTFM/download?&h=1280",
  "https://unsplash.com/photos/m35LirqP6y8/download?&h=1280",
  "https://unsplash.com/photos/OVO8nK-7Rfs/download?&h=1280",
  "https://unsplash.com/photos/2dp1Ud5gG2A/download?&h=1280",
  "https://wallpaperaccess.com/full/8779679.jpg",
];

let state = {
  users: [],
  userMode: "hideContent",
  myMessagesMode: "normal",
  backgroundUrls: [],
  activeBackgroundUrl: "",
};

const userInput = document.getElementById("userInput");
const usersTableBody = document
  .getElementById("usersTable")
  .querySelector("tbody");

const userModeGroup = document.getElementById("userModeGroup");

const myMessagesGroup = document.getElementById("myMessagesGroup");

const bgInput = document.getElementById("bgInput");
const bgTableBody = document.getElementById("bgTable").querySelector("tbody");

function saveState(partial) {
  state = { ...state, ...partial };
  chrome.storage.sync.set(partial);
}

function renderUsers() {
  usersTableBody.innerHTML = "";
  state.users.forEach((u, index) => {
    const tr = document.createElement("tr");

    const checkboxId = `user-hide-${index}`;

    // FAMILYNAME td wrapped entirely in label for the checkbox
    const tdName = document.createElement("td");
    const nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", checkboxId);
    nameLabel.textContent = u.name;
    nameLabel.style.display = "block";
    nameLabel.style.width = "100%";
    tdName.appendChild(nameLabel);
    tr.appendChild(tdName);

    // Hide td WRAPPED IN LABEL
    const tdHide = document.createElement("td");
    const hideLabel = document.createElement("label");
    hideLabel.setAttribute("for", checkboxId);
    hideLabel.style.display = "block";
    hideLabel.style.width = "100%";

    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.id = checkboxId;
    chk.checked = !!u.enabled;
    chk.addEventListener("change", () => {
      const users = [...state.users];
      users[index] = { ...users[index], enabled: chk.checked };
      saveState({ users });
    });

    hideLabel.appendChild(chk);
    tdHide.appendChild(hideLabel);
    tr.appendChild(tdHide);

    const tdRemove = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = "X";
    btn.addEventListener("click", () => {
      const users = state.users.filter((_, i) => i !== index);
      saveState({ users });
      renderUsers();
    });
    tdRemove.appendChild(btn);
    tr.appendChild(tdRemove);

    usersTableBody.appendChild(tr);
  });
}

function renderUserMode() {
  const inputs = userModeGroup.querySelectorAll("input[name='userMode']");
  inputs.forEach((input) => {
    input.checked = input.value === state.userMode;
  });
}

function renderMyMessagesMode() {
  const inputs = myMessagesGroup.querySelectorAll(
    "input[name='myMessagesMode']",
  );
  inputs.forEach((input) => {
    input.checked = input.value === state.myMessagesMode;
  });
}

function renderBackgrounds() {
  bgTableBody.innerHTML = "";
  state.backgroundUrls.forEach((url, index) => {
    const tr = document.createElement("tr");

    const radioId = `bg-use-${index}`;

    const tdUse = document.createElement("td");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "bgUse";
    radio.id = radioId;
    radio.checked = url === state.activeBackgroundUrl;
    radio.addEventListener("change", () => {
      saveState({ activeBackgroundUrl: url });
    });

    const useLabel = document.createElement("label");
    useLabel.setAttribute("for", radioId);
    useLabel.style.display = "inline-block";
    useLabel.style.width = "100%";
    useLabel.appendChild(radio);
    tdUse.appendChild(useLabel);
    tr.appendChild(tdUse);

    const tdUrl = document.createElement("td");
    const urlLabel = document.createElement("label");
    urlLabel.setAttribute("for", radioId);
    urlLabel.style.display = "inline-block";
    urlLabel.style.width = "100%";
    urlLabel.textContent = url;
    tdUrl.appendChild(urlLabel);
    tr.appendChild(tdUrl);

    const tdRemove = document.createElement("td");
    if (url != "none") {
      const btn = document.createElement("button");
      btn.textContent = "X";
      btn.addEventListener("click", () => {
        const newUrls = state.backgroundUrls.filter((_, i) => i !== index);
        let active = state.activeBackgroundUrl;
        if (url === active) {
          active = newUrls[0] || "";
        }
        saveState({
          backgroundUrls: newUrls,
          activeBackgroundUrl: active,
        });
        renderBackgrounds();
      });
      tdRemove.appendChild(btn);
    }
    tr.appendChild(tdRemove);

    bgTableBody.appendChild(tr);
  });
}

function attachEvents() {
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = userInput.value.trim();
      if (!val) return;
      const exists = state.users.some(
        (u) => u.name.toLowerCase() === val.toLowerCase(),
      );
      if (!exists) {
        const users = [...state.users, { name: val, enabled: true }];
        saveState({ users });
        renderUsers();
      }
      userInput.value = "";
    }
  });

  userModeGroup.addEventListener("change", (e) => {
    if (e.target.name === "userMode") {
      saveState({ userMode: e.target.value });
    }
  });

  myMessagesGroup.addEventListener("change", (e) => {
    if (e.target.name === "myMessagesMode") {
      saveState({ myMessagesMode: e.target.value });
    }
  });

  bgInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = bgInput.value.trim();
      if (!val) return;
      if (!state.backgroundUrls.includes(val)) {
        const newUrls = [...state.backgroundUrls, val];
        const active = state.activeBackgroundUrl || val;
        saveState({
          backgroundUrls: newUrls,
          activeBackgroundUrl: active,
        });
        renderBackgrounds();
      }
      bgInput.value = "";
    }
  });
}

function init() {
  chrome.storage.sync.get(
    {
      users: [],
      userMode: "hideContent",
      myMessagesMode: "normal",
      backgroundUrls: DEFAULT_BG_URLS,
      activeBackgroundUrl: DEFAULT_BG_URLS[0] || "",
    },
    (data) => {
      state = data;
      renderUsers();
      renderUserMode();
      renderMyMessagesMode();
      renderBackgrounds();
      attachEvents();
    },
  );
}

document.addEventListener("DOMContentLoaded", init);
