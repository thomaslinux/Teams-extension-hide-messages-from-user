// ==UserScript==
// @name        Hide Users Messages cloud.microsoft
// @namespace   Violentmonkey Scripts
// @match       https://teams.cloud.microsoft/*
// @grant       none
// @version     2026.03.03.14.05
// @author      thomaslinux9 && perplexity.ai
// @description 03/03/2026 14:05:00
// @run-at      document-idle
// ==/UserScript==

const hideUsers = ["USER1", "USER2"];

window.addEventListener("load", () => {
  console.log("Hide users:", hideUsers);

  // Build the CSS selector from hideUsers
  const selector = hideUsers
    .map(
      (u) =>
        `div[class*="fui-ChatMessage"]:has(img[src*="${u}"]) div[data-message-content]`,
    )
    .join(",\n");

  const style = document.createElement("style");
  style.textContent = `
    ${selector} {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
});

// javascript select users using name
let users = [];
document
  .querySelectorAll("span[data-tid*=message-author-name]")
  .forEach((span) => {
    if ((span.textContent.includes = "LASTNAME")) {
      users.push(span);
    }
  });

// document.querySelector('div[data-tid="message-pane-list-runway"]').addEventListener('e', () => {
//   console.log('event change on the element');
// })

const hideUsers = ["USER1", "USER2"];

// listen changes on the DOM
const target = document.querySelector(
  'div[data-tid="message-pane-list-runway"]',
);

if (target) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      console.log("DOM changed:", mutation);
      document
        .querySelectorAll("span[data-tid*=message-author-name]")
        .forEach((span) => {
          console.log("span.innerText", span.innerText);
          console.log("span.classList", span.classList);
          span.classList.add("detectedAuthor");
          for (const userToHide of hideUsers) {
            if (
              text.endsWith(userToHide) &&
              (text === userToHide ||
                text.slice(0, -userToHide.length).trim().endsWith(" "))
            ) {
              span.classList.add("hideThatUserMessage");
              console.log("Hiding message from:", userToHide);
              break; // Found match, move to next span
            }
          }
        });
    }
  });

  observer.observe(target, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}
