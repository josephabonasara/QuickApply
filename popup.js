(function() {
  let fileName = "cover_letter.pdf";
  let pdfRequested = false;

  document.addEventListener('DOMContentLoaded', () => {
      fetchCoverLetterTemplate();
      setupEventListeners();
  });

  function fetchCoverLetterTemplate() {
      fetch('coverletter.docx')
          .then(response => response.arrayBuffer())
          .then(arrayBuffer => mammoth.convertToHtml({ arrayBuffer }))
          .then(displayResult)
          .catch(error => console.error('Error fetching cover letter template:', error));
  }

  function displayResult(result) {
      let coverLetterContent = result.value;

      chrome.storage.sync.get(['companyName', 'positionName', 'location'], items => {
          const { companyName = '', positionName = '', location = '' } = items;

          coverLetterContent = replacePlaceholders(coverLetterContent, companyName, positionName, location);

          const coverLetterDiv = document.getElementById('cover-letter');
          coverLetterDiv.innerHTML = coverLetterContent;
          coverLetterDiv.contentEditable = true;
          applyStylingToParagraphs(coverLetterDiv, companyName, location);

          // Set the file name based on the company name
          fileName = `coverletter_${companyName}.pdf`;
      });
  }

  function replacePlaceholders(content, companyName, positionName, location) {
      return content
          .replaceAll("[Company Name]", companyName)
          .replaceAll("[Position]", positionName)
          .replaceAll("[Location]", location);
  }

  function applyStylingToParagraphs(element, companyName, location) {
      const paragraphs = element.querySelectorAll('p');
      paragraphs.forEach(paragraph => {
          if (paragraph.textContent.startsWith(companyName) || paragraph.textContent.startsWith(location)) {
              paragraph.classList.add('highlight');
              paragraph.style.marginTop = '0';
              paragraph.style.marginBottom = '0';
          }
      });
  }

  function saveCoverLetter() {
      const coverLetterContent = `<div style='font-size: 6px; font-family: Times New Roman; padding: 35px 30px; width: 255px;'>${document.getElementById('cover-letter').innerHTML}</div>`;
      console.log(coverLetterContent);

      if (pdfRequested) {
          const pdf = new jsPDF('p', 'pt', 'a4');
          pdf.setFont("arial", "bold");
          pdf.setFontSize(6);

          pdf.html(coverLetterContent, {
              callback: function(pdf) {
                  pdf.save(fileName);
              }
          });
      }
  }

  function setupEventListeners() {
      const convertToPDFButton = document.getElementById('convertToPDF');
      convertToPDFButton.addEventListener('click', () => {
          pdfRequested = true;
          saveCoverLetter();
      });
  }
})();