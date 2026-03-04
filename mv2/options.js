document.addEventListener("DOMContentLoaded", init);

async function init() {
  const defaults = { enabled: true, mode: "content", users: [] };
  const settings = Object.assign(
    defaults,
    await browser.storage.sync.get(defaults),
  );

  const enabledCheckbox = document.getElementById("enabled");
  const modeSelect = document.getElementById("mode");
  const userInput = document.getElementById("userInput");
  const addUserButton = document.getElementById("addUser");
  const userTableBody = document.querySelector("#userTable tbody");

  enabledCheckbox.checked = settings.enabled;
  modeSelect.value = settings.mode;

  function renderUsers() {
    userTableBody.innerHTML = "";
    settings.users.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.name}</td>
        <td><input type="checkbox" ${user.enabled ? "checked" : ""}></td>
        <td><button>Remove</button></td>
      `;
      const [hideCb, removeBtn] = row.querySelectorAll("input, button");

      hideCb.addEventListener("change", async () => {
        user.enabled = hideCb.checked;
        await saveSettings();
      });

      removeBtn.addEventListener("click", async () => {
        settings.users.splice(index, 1);
        await saveSettings();
        renderUsers();
      });

      userTableBody.appendChild(row);
    });
  }

  async function saveSettings() {
    await browser.storage.sync.set(settings);
  }

  addUserButton.addEventListener("click", async () => {
    const name = userInput.value.trim();
    if (name && !settings.users.find((u) => u.name === name)) {
      settings.users.push({ name, enabled: true });
      userInput.value = "";
      await saveSettings();
      renderUsers();
    }
  });

  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addUserButton.click();
  });

  enabledCheckbox.addEventListener("change", async () => {
    settings.enabled = enabledCheckbox.checked;
    await saveSettings();
  });

  modeSelect.addEventListener("change", async () => {
    settings.mode = modeSelect.value;
    await saveSettings();
  });

  renderUsers();
}
