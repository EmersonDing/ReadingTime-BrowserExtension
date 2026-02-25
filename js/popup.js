document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  
  if (tab) {
    try {
      const response = await chrome.tabs.sendMessage(tab.id, {action: "getWordCount"});
      if (response) {
        document.getElementById('words').textContent = response.wordCount;
        document.getElementById('cjk').textContent = response.cjkCount;
      }
    } catch (e) {
      document.body.innerHTML = "<p>Cannot read page content. Try refreshing the page.</p>";
    }
  }
});