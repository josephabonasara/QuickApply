document.getElementById("continueButton").addEventListener("click", function() {
    // Get user input values
    var companyName = document.getElementById("company-name").value;
    var positionName = document.getElementById("position-name").value;
    var location = document.getElementById("location").value;
  
    // Store values in Chrome storage
    chrome.storage.sync.set({
      companyName: companyName,
      positionName: positionName,
      location: location
    }, function() {
      // Redirect to popup.html
      window.location.href = "popup.html";
    });
  });
  