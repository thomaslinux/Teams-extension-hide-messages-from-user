(async function () {
  const STYLE_ID = "hideUsers";

  async function getSettings() {
    const defaults = { enabled: true, mode: "content", users: [] };
    const data = await browser.storage.sync.get(defaults);
    return Object.assign(defaults, data);
  }

  function buildCSS(settings) {
    if (!settings.enabled) return "";

    const enabledUsers = settings.users.filter((u) => u.enabled);
    if (enabledUsers.length === 0) return "";

    const selectors = enabledUsers.map((u) => {
      const match = `img[src*="${u.name}"]`;
      if (settings.mode === "content") {
        return `div[class*="fui-ChatMessage"]:has(${match}) div[data-message-content]`;
      } else {
        return `div[class*="fui-ChatMessage"]:has(${match})`;
      }
    });

    return `${selectors.join(", ")} { display: none !important; }`;
  }

  async function applyCSS() {
    const settings = await getSettings();
    let styleEl = document.getElementById(STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(styleEl);
    }
    styleEl.textContent = buildCSS(settings);
  }

  browser.storage.onChanged.addListener(applyCSS);
  await applyCSS();
})();
