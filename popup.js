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
        coverLetterDiv.innerHTML = coverLetterContent;
        coverLetterDiv.contentEditable = true;
        coverLetterDiv.addEventListener('input', saveCoverLetter);
        var messageHtml = result.messages.map(function(message) {
          return '<li class="' + message.type + '">' + escapeHtml(message.message) + "</li>";
        }).join("");
  
        // Apply font style and size to the cover letter content
        coverLetterDiv.style.fontFamily = 'Times New Roman';
        coverLetterDiv.style.fontSize = '12px';
        coverLetterDiv.style.margin = '0';
        coverLetterDiv.style.padding = '0';
        coverLetterDiv.style.lineHeight = '1.5';
      });
    }
  
    function saveCoverLetter() {
      // Retrieve the updated cover letter content
      var coverLetterContent = "<div style='font-size:6px; padding: 05px 05px; width:300px;'>"+ document.getElementById('cover-letter').innerHTML +"</div>";
  
      // Generate a PDF from the cover letter content
      var pdf = new jsPDF('p', 'pt', 'a4');
      pdf.setFont("Times New Roman");
    pdf.setFontSize(6);
        

      pdf.html(coverLetterContent, {
        callback: function(pdf) {
          // Save the generated PDF
          pdf.save('cover_letter.pdf');
        }
      });
    }
  
    // Attach click event listener to the "Convert to PDF" button
    var convertToPDFButton = document.getElementById('convertToPDF');
    convertToPDFButton.addEventListener('click', saveCoverLetter);
  })();
  