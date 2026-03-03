let styleEl;

// Load settings and apply
chrome.storage.sync.get(
  ["hideUsers", "hideMode"],
  ({ hideUsers = [], hideMode = "content" }) => {
    applyHideStyles(hideUsers, hideMode);
  },
);

// Listen for updates from popup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "updateHideList") {
    applyHideStyles(msg.hideUsers, msg.hideMode);
  }
});

function applyHideStyles(hideUsers, hideMode) {
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "hideUsers";
    document.head.appendChild(styleEl);
  }

  if (!hideUsers || hideUsers.length === 0) {
    styleEl.textContent = "";
    return;
  }

  const selector = hideUsers
    .filter((u) => u.enabled)
    .map((u) => {
      const base = `div[class*="fui-ChatMessage"]:has(img[src*="${u.name}"])`;
      return hideMode === "message"
        ? base
        : `${base} div[data-message-content]`;
    })
    .join(",\n");

  styleEl.textContent = `${selector} { display: none !important; }`;
}
