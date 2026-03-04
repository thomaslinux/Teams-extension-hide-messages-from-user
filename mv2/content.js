const styleId = "hideUsersStyle";

function applyHideUsersSettings() {
  chrome.storage.sync.get(["hideUsers", "mode", "enabled"], (data) => {
    const { hideUsers = [], mode = "content", enabled = true } = data;

    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      (document.head || document.documentElement).appendChild(style);
    }

    if (!enabled || !hideUsers.length) {
      style.textContent = "";
      return;
    }

    const selector = hideUsers
      .map((u) =>
        mode === "content"
          ? `div[class*="fui-ChatMessage"]:has(img[src*="${u}"]) div[data-message-content]`
          : `div[class*="fui-ChatMessage"]:has(img[src*="${u}"])`,
      )
      .join(",\n");

    style.textContent = selector
      ? `${selector} { display: none !important; }`
      : "";
  });
}

function initHideUsers() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyHideUsersSettings);
  } else {
    applyHideUsersSettings();
  }
}

initHideUsers();
chrome.storage.onChanged.addListener(applyHideUsersSettings);
