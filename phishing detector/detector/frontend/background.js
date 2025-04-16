const API_KEY = "AIzaSyBUkfgR_0Q06NG__sEP4T08wDpZhxQc3i0"; // ← replace with your actual key

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "prediction_result") {
    if (message.prediction === 1) {
      alert("⚠️ Warning: Phishing detected!!");
    } else if (message.prediction === -1) {
      alert("✅ No phishing detected");
    }
  }

  if (message.type === "check_url") {
    const urlToCheck = message.url;

    fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client: {
          clientId: "phishing-detective",
          clientVersion: "1.0"
        },
        threatInfo: {
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
            "POTENTIALLY_HARMFUL_APPLICATION"
          ],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [
            { url: urlToCheck }
          ]
        }
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.matches && data.matches.length > 0) {
        sendResponse({ safe: false }); // flagged as unsafe
      } else {
        sendResponse({ safe: true }); // safe
      }
    })
    .catch(error => {
      console.error("Google Safe Browsing error:", error);
      sendResponse({ safe: true, error: "API error, assuming safe" }); // fallback to safe
    });

    return true; // keep the message channel open
  }
});
