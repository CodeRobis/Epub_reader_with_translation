import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import ePub from 'epubjs';

function EpubReader() {
  const viewerRef = useRef();
  const [rendition, setRendition] = useState(null);
  const [locations, setLocations] = useState(null);
  const [translatedText, setTranslatedText] = useState(null); // State for the translated text
  const location = useLocation();
  const navigate = useNavigate();
  const bookUrl = location.state.url;

  const handleBack = () => {
    navigate('/library');
  };

  const nextPage = () => {
    if (rendition) rendition.next();
  };

  const prevPage = () => {
    if (rendition) rendition.prev();
  };

  // Function to close the pop-up
  const closePopup = () => {
    setTranslatedText(null);
  };

  useEffect(() => {
    let resizeObserver;
    let renditionInstance;

    (async () => {
      try {
        const book = await ePub(bookUrl);
        renditionInstance = book.renderTo(viewerRef.current, { width: '100%', height: '100%' });
        setRendition(renditionInstance);
        await renditionInstance.display();

        renditionInstance.on('selected', async (cfiRange, contents) => {
          const selectedText = renditionInstance.getRange(cfiRange).toString();
          const response = await fetch(`http://localhost:3001/translate?text=${selectedText}&to=en`);
          const data = await response.json();

          setTranslatedText(data.text); // Update the state with the translated text
        });

        resizeObserver = new ResizeObserver(entries => {
          for (let entry of entries) {
            if (entry.contentBoxSize) {
              renditionInstance.resize(entry.contentBoxSize.inlineSize, entry.contentBoxSize.blockSize);
            } else {
              renditionInstance.resize(entry.contentRect.width, entry.contentRect.height);
            }
          }
        });

        resizeObserver.observe(viewerRef.current);
      } catch (error) {
        console.error("Error in loading/displaying book:", error);
      }
    })();

    return () => {
      if (renditionInstance) {
        renditionInstance.destroy();
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [bookUrl]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div
        id="viewer"
        style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        ref={viewerRef}
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={prevPage}>Previous</button>
        <button onClick={nextPage}>Next</button>
      </div>
      <button onClick={handleBack}>Back to library</button>

         {/* Pop-up for the translated text */}
         {translatedText && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '10px', border: '1px solid black', borderRadius: '5px' }}>
          <p>{translatedText}</p>
          <button onClick={closePopup}>Close</button>
        </div>
      )}
    </div>
  );
}

export default EpubReader;

