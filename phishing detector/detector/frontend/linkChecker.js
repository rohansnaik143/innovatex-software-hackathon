function checkWithGoogleSafeBrowsing(url, callback) {
  chrome.runtime.sendMessage({ type: "check_url", url: url }, (response) => {
    callback(response);
  });
}

function checkLink() {
  const input = document.getElementById("urlInput").value.trim();
  const resultBox = document.getElementById("result");

  if (!input) {
    resultBox.style.color = "#6c757d";
    resultBox.innerText = "Please enter a URL.";
    return;
  }

  try {
    new URL(input); // validate
  } catch {
    resultBox.style.color = "#dc3545";
    resultBox.innerText = "Invalid URL format.";
    return;
  }

  resultBox.style.color = "#007bff";
  resultBox.innerText = "Checking...";

  checkWithGoogleSafeBrowsing(input, (res) => {
    if (res.safe === false) {
      resultBox.style.color = "#dc3545";
      resultBox.innerText = "🚨 Phishing suspected: Google flagged this URL.";
    } else if (res.safe === true) {
      resultBox.style.color = "#28a745";
      resultBox.innerText = "✅ This link is safe.";
    } else {
      resultBox.style.color = "#ffc107";
      resultBox.innerText = "⚠️ Unable to verify. Please try again.";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const urlInput = document.getElementById("urlInput");

  urlInput.addEventListener("paste", () => {
    setTimeout(checkLink, 100);
  });

  urlInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      checkLink();
    }
  });

  urlInput.focus();
});
