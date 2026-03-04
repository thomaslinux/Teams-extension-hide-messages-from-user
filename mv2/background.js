const DEFAULT_BACKGROUNDS = [
  {
    url: "none",
    active: true,
  },
  {
    url: "https://unsplash.com/photos/PZMeVJwCTFM/download?&h=1280",
    active: false,
  },
  {
    url: "https://unsplash.com/photos/m35LirqP6y8/download?&h=1280",
    active: false,
  },
  {
    url: "https://unsplash.com/photos/OVO8nK-7Rfs/download?&h=1280",
    active: false,
  },
  {
    url: "https://unsplash.com/photos/2dp1Ud5gG2A/download?&h=1280",
    active: false,
  },
  { url: "https://wallpaperaccess.com/full/8779679.jpg", active: false },
];

browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.get("backgrounds").then((res) => {
    if (!res.backgrounds || res.backgrounds.length === 0) {
      // Seed backgrounds only the first time (or if user cleared settings)
      browser.storage.local.set({ backgrounds: DEFAULT_BACKGROUNDS });
    }
  });
});
