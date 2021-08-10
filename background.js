chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        files: ["./getMultimedias.js"],
      })
      .then((res) => {
        console.log("executed getMultimedias script");
      })
      .catch((err) => console.log(err));
  }
});
