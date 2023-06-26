document.addEventListener('DOMContentLoaded', () => {
    const coverLetterContentInput = document.getElementById('coverLetterContent');
    const coverLetterFileInput = document.getElementById('coverLetterFile');
    const convertToPDFButton = document.getElementById('convertToPDF');
  
    // Retrieve the stored cover letter content
    chrome.storage.local.get('coverLetterContent', (data) => {
      const { coverLetterContent } = data;
      // Pre-fill the cover letter content with stored data
      coverLetterContentInput.value = coverLetterContent || '';
  
      // Update the cover letter content when the user makes changes
      coverLetterContentInput.addEventListener('input', (event) => {
        // Update the cover letter content in storage
        chrome.storage.local.set({ coverLetterContent: event.target.value });
      });
    });
  
    // Handle file upload
    coverLetterFileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const content = event.target.result;
          // Convert the Word document content to plain text and update the cover letter content
          coverLetterContentInput.value = convertWordToPlainText(content);
        };
        reader.readAsText(file);
      }
    });
  
    // Function to convert Word document content to plain text
    function convertWordToPlainText(content) {
      // Implement the necessary logic to convert Word document to plain text
      // You can use libraries or APIs specifically designed for this purpose
      // Here's a simple example using regular expressions to remove formatting:
      const plainText = content.replace(/<\/?[^>]+(>|$)/g, '');
      return plainText;
    }
  });
  