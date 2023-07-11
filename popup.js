(function() {
    fetch('coverletter.docx')
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
          .then(displayResult)
          .catch(error => console.error(error));
      });
  
    var pdfRequested = false; // Flag to indicate if PDF conversion was requested
  
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
        coverLetterDiv.innerHTML = coverLetterContent;
        coverLetterDiv.contentEditable = true;
  
        applyStylingToParagraphs(coverLetterDiv,companyName,location);

        // Attach input event listener to the cover letter text box
        coverLetterDiv.addEventListener('input', function() {
          pdfRequested = false; // Reset the flag to prevent automatic PDF conversion
        });
  
        var messageHtml = result.messages.map(function(message) {
          return '<li style=\'padding-inline: 200px;\' class="' + message.type + '">' + escapeHtml(message.message) + "</li>";
        }).join("");
  
        // Apply font style and size to the cover letter content
        coverLetterDiv.style.fontFamily = 'Times New Roman';
        coverLetterDiv.style.fontSize = '12px';
        coverLetterDiv.style.margin = '0';
        coverLetterDiv.style.padding = '0';
      });
    }
  
    function applyStylingToParagraphs(element,companyName, location) {
        var paragraphs = element.querySelectorAll('p');
    
        paragraphs.forEach(function(paragraph) {
          if (paragraph.textContent.startsWith(companyName) ||paragraph.textContent.startsWith(location)) {
            // Apply specific CSS class or inline styles to the matching <p> element
            paragraph.classList.add('highlight'); // Add a CSS class
            paragraph.style.marginTop = '0';
            paragraph.style.marginBottom='0';
          }
        });
      }

    function saveCoverLetter() {
      // Retrieve the updated cover letter content
      var coverLetterContent = "<div style='font-size: 6px; font-family: Times New Roman; padding: 35px 30px; width: 255px;'>" + document.getElementById('cover-letter').innerHTML+ "</div>";
        console.log(coverLetterContent);
      // Generate a PDF from the cover letter content only when the button was clicked
      if (pdfRequested) {
        var pdf = new jsPDF('p', 'pt', 'a4');
        pdf.setFont("arial", "bold");
        pdf.setFontSize(6);
  
        pdf.html(coverLetterContent, {
          callback: function(pdf) {
            // Save the generated PDF
            pdf.save('cover_letter.pdf');
          }
        });
      }
    }
  
    // Attach click event listener to the "Convert to PDF" button
    var convertToPDFButton = document.getElementById('convertToPDF');
    convertToPDFButton.addEventListener('click', function() {
      pdfRequested = true; // Set the flag to indicate that PDF conversion was requested
      saveCoverLetter();
    });
  })();
  