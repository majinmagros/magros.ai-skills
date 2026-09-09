# Chrome Extension — manifest.json + content.js (ponte extension ↔ agent)

```javascript
// chrome-extension/manifest.json
{
  "name": "Claude Automation",
  "permissions": [
    "activeTab",
    "scripting",
    "tabs",
    "webNavigation",
    "storage"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }]
}
```

```javascript
// content.js - Content script para comunicação
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "navigate":
      window.location.href = request.url;
      sendResponse({success: true});
      break;
    case "scrape":
      const data = scrapePage(request.selectors);
      sendResponse({data});
      break;
    case "fill_form":
      fillForm(request.data);
      sendResponse({success: true});
      break;
  }
});
```

Alternativa headless (sem extensão): [Puppeteer](https://pptr.dev/).
