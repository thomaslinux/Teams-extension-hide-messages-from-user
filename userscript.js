const hideUsers = ["USER1", "USER2"];

window.addEventListener("load", () => {
  console.log("Hide users:", hideUsers);

  // Build the CSS selector from hideUsers
  const selector = hideUsers
    .map(
      (u) =>
        `div[class*="fui-ChatMessage"]:has(img[src*="${u}"]) div[data-message-content]`,
    )
    .join(",\\n");

  const style = document.createElement("style");
  style.textContent = `
    ${selector} {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
});
