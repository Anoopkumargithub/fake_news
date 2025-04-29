chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "checkFakeNews",
      title: "Check Fake News",
      contexts: ["selection"],
    });
  });
  
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "checkFakeNews" && info.selectionText) {
      try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: info.selectionText.trim() }),
        });
  
        const result = await response.json();
        const message = `
          Prediction: ${result.prediction}
          Confidence: ${(result.confidence * 100).toFixed(2)}%
        `;
  
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon.png",
          title: "Fake News Detector",
          message: message,
        });
      } catch (error) {
        console.error(error);
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon.png",
          title: "Fake News Detector",
          message: "Error: Could not connect to the backend API.",
        });
      }
    }
  });