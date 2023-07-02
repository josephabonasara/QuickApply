  (function() {
    fetch('coverletter.docx')
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
          .then(displayResult)
          .catch(error => console.error(error));
      });
  
    function displayResult(result) {
      var coverLetterContent = result.value;
  
      // Retrieve user input values from Chrome storage
      chrome.storage.sync.get(['companyName', 'positionName', 'location'], function(items) {
        var companyName = items.companyName || '';
        var positionName = items.positionName || '';
        var location = items.location || '';
  
        // Replace placeholders in cover letter content
        coverLetterContent = coverLetterContent.replaceAll("[Company Name]", companyName);
        coverLetterContent = coverLetterContent.replaceAll("[Position]", positionName);
        coverLetterContent = coverLetterContent.replaceAll("[Location]", location);
  
        // Set the modified cover letter content in the output element
        var coverLetterDiv = document.getElementById('cover-letter');
        coverLetterDiv.innerHTML = result.value;
        coverLetterDiv.innerHTML = coverLetterContent;
        coverLetterDiv.contentEditable = true;
        coverLetterDiv.addEventListener('input', saveCoverLetter);
        var messageHtml = result.messages.map(function(message) {
          return '<li class="' + message.type + '">' + escapeHtml(message.message) + "</li>";
        }).join("");
      });
    }

    function saveCoverLetter() {
        // Retrieve the updated cover letter content
        var coverLetterContent = document.getElementById('cover-letter').value;
    
        // Generate a PDF from the cover letter content
        var pdf = new jsPDF();
        pdf.fromHTML(coverLetterContent, 15, 15, {
          width: 180
        }, function() {
          // Save the generated PDF
          pdf.save('cover_letter.pdf');
        });
      }
    
      // Attach click event listener to the "Convert to PDF" button
      var convertToPDFButton = document.getElementById('convertToPDF');
      convertToPDFButton.addEventListener('click', saveCoverLetter);
    })();
  