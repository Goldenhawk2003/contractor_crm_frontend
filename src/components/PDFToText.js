import React, { useState } from 'react';

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';

const PdfTextExtractor = () => {
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  const extractTextFromPdf = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        fullText += strings.join(' ') + '\n';
      }

      setText(fullText);
      setError(null);
    } catch (err) {
      console.error('Failed to extract text from PDF', err);
      setError('Failed to extract text from PDF');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) extractTextFromPdf(file);
  };

  return (
    <div>
      <h2>Upload a PDF to extract text</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {text && (
        <div style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
          <h3>Extracted Text:</h3>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default PdfTextExtractor;