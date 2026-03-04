let hideUsers = [];
let hideMode = "content";
let myMessagesMode = "none";
let bgUrl = "";

function buildSelector() {
  const base =
    hideMode === "content"
      ? `div[class*="fui-ChatMessage"]:has(img[src*="{{u}}"]) div[data-message-content]`
      : `div[class*="fui-ChatMessage"]:has(img[src*="{{u}}"])`;

  let selectors = hideUsers
    .filter((u) => u.enabled)
    .map((u) => base.replace("{{u}}", u.name));

  if (myMessagesMode === "hide") {
    selectors.push(`div[class*="fui-ChatMyMessage"]`);
  } else if (myMessagesMode === "only") {
    selectors.push(
      `div[class*="fui-ChatMessage"]:not([class*="fui-ChatMyMessage"])`,
    );
  }

  return selectors.join(",\n");
}

function applyCSS() {
  let style = document.getElementById("hideUsersStyle");
  if (!style) {
    style = document.createElement("style");
    style.id = "hideUsersStyle";
    document.head.appendChild(style);
  }

  const selector = buildSelector();
  let css = selector ? `${selector} { display: none !important; }` : "";

  if (bgUrl) {
    css += `
      .ui-flex.a.b.c.d.i.j.k.l.m.n {
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('${bgUrl}');
      }
    `;
  }

  style.textContent = css;
}

browser.storage.local
  .get(["hideUsers", "hideMode", "myMessagesMode", "bgUrl"])
  .then((res) => {
    hideUsers = res.hideUsers || [];
    hideMode = res.hideMode || "content";
    myMessagesMode = res.myMessagesMode || "none";
    bgUrl = res.bgUrl || "";
    applyCSS();
  });

browser.storage.onChanged.addListener((changes) => {
  if (changes.hideUsers) hideUsers = changes.hideUsers.newValue;
  if (changes.hideMode) hideMode = changes.hideMode.newValue;
  if (changes.myMessagesMode) myMessagesMode = changes.myMessagesMode.newValue;
  if (changes.bgUrl) bgUrl = changes.bgUrl.newValue;
  applyCSS();
});
