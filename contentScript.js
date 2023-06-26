// Extract company name and location from the web page
const companyName = document.querySelector('.company-name').innerText;
const location = document.querySelector('.location').innerText;

// Send the extracted data to the background script
chrome.runtime.sendMessage({
  action: 'updateCoverLetter',
  companyName,
  location
});
