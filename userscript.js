// ==UserScript==
// @name        Hide Users Messages cloud.microsoft
// @namespace   Violentmonkey Scripts
// @match       https://teams.cloud.microsoft/*
// @grant       none
// @version     2026.03.10.14.05
// @author      thomaslinux9 && perplexity.ai
// @description Hide Users Messages cloud.microsoft
// @run-at      document-idle
// ==/UserScript==

// const hideUsers = ["USER1", "USER2"];

// window.addEventListener("load", () => {
//   console.log("Hide users:", hideUsers);

//   // Build the CSS selector from hideUsers
//   const selector = hideUsers
//     .map(
//       (u) =>
//         `div[class*="fui-ChatMessage"]:has(img[src*="${u}"]) div[data-message-content]`,
//     )
//     .join(",\n");

//   const style = document.createElement("style");
//   style.textContent = `
//     ${selector} {
//       display: none !important;
//     }
//   `;
//   document.head.appendChild(style);
// });

// // javascript select users using name
// let users = [];
// document
//   .querySelectorAll("span[data-tid*=message-author-name]")
//   .forEach((span) => {
//     if ((span.textContent.includes = "LASTNAME")) {
//       users.push(span);
//     }
//   });

// document.querySelector('div[data-tid="message-pane-list-runway"]').addEventListener('e', () => {
//   console.log('event change on the element');
// })

window.addEventListener("load", () => {
  let usersToHide = [];

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
            // console.log("span.innerText", span.innerText);
            // console.log("span.classList", span.classList);

            usersToHide.forEach((userToHide) => {
              if (span.innerText == userToHide) {
                // console.log(
                //   "span.innerText == userToHide:",
                //   span.innerText == userToHide,
                // );
                if (!span.classList.contains("userToHide")) {
                  span.classList.add("userToHide");
                }
              }
            });
          });
      }
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  console.log("Instructions : to hide a user, in console write");
  console.log('usersToHide.push("John DOE")');
  console.log("Instructions : to show a user, in console write");
  console.log("usersToHide = []");

  const style = document.createElement("style");
  style.id = "hideThoseUsers";
  style.textContent = `div[class*="fui-ChatMessage"]:has(span.userToHide),
empty {
    display: none;
}`;
  document.head.appendChild(style);
});
