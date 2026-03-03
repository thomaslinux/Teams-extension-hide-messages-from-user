let styleEl;

function updateCSS(hideUsers, enabled) {
  if (styleEl) styleEl.remove();
  if (!enabled) return;

  const activeUsers = (hideUsers || [])
    .filter((u) => u.hidden)
    .map((u) => u.name);
  if (!activeUsers.length) return;

  const selector = activeUsers
    .map(
      (u) =>
        `div[class*="fui-ChatMessage"]:has(img[src*="${u}"]) div[data-message-content]`,
    )
    .join(",\n");

  styleEl = document.createElement("style");
  styleEl.textContent = `${selector} { display: none !important; }`;
  document.head.appendChild(styleEl);
}

chrome.runtime.sendMessage(
  { type: "getHideUsers" },
  ({ hideUsers, enabled }) => {
    updateCSS(hideUsers, enabled);
  },
);

chrome.storage.onChanged.addListener(() => {
  chrome.storage.sync.get(
    ["hideUsers", "enabled"],
    ({ hideUsers, enabled }) => {
      updateCSS(hideUsers, enabled);
    },
  );
});
