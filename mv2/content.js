let hideUsers = [];
let hideMode = "content"; // or "message"

function buildSelector() {
  const base =
    hideMode === "content"
      ? `div[class*="fui-ChatMessage"]:has(img[src*="{{u}}"]) div[data-message-content]`
      : `div[class*="fui-ChatMessage"]:has(img[src*="{{u}}"])`;
  return hideUsers
    .filter((u) => u.enabled)
    .map((u) => base.replace("{{u}}", u.name))
    .join(",\n");
}

function applyCSS() {
  let style = document.getElementById("hideUsersStyle");
  if (!style) {
    style = document.createElement("style");
    style.id = "hideUsersStyle";
    document.head.appendChild(style);
  }

  const selector = buildSelector();
  style.textContent = selector
    ? `${selector} { display: none !important; }`
    : "";
}

browser.storage.local.get(["hideUsers", "hideMode"]).then((res) => {
  hideUsers = res.hideUsers || [];
  hideMode = res.hideMode || "content";
  applyCSS();
});

browser.storage.onChanged.addListener((changes) => {
  if (changes.hideUsers || changes.hideMode) {
    hideUsers = changes.hideUsers?.newValue || hideUsers;
    hideMode = changes.hideMode?.newValue || hideMode;
    applyCSS();
  }
});
