import React, { useEffect, useState } from 'react';
import { getStorage, ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { auth } from './firebase';

function EpubLibrary() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const storage = getStorage();

  useEffect(() => {
    async function fetchFiles() {
      const uid = auth.currentUser.uid;
      const listRef = ref(storage, `epub-files/${uid}`);
  
      try {
        console.log(uid, listRef);
        const res = await listAll(listRef);
        console.log(res.items);
        const filesData = await Promise.all(
          res.items.map(async (item) => {
            const url = await getDownloadURL(item);
            return { ref: item, url };
          })
        );
  
        setFiles(filesData);
      } catch (error) {
        console.log("Error while fetching files", error);
      }
    }
  
    fetchFiles();
  }, [storage]);

  const handleGoToLanding = () => {
    navigate('/');
  };

  const handleRead = (url) => {
    navigate('/reader', { state: { url } });
  }

  const handleDelete = async (fileRef) => {
    try {
      await deleteObject(fileRef);
      // Remove this file URL from the state
      setFiles((prevFiles) => prevFiles.filter((file) => file.ref !== fileRef));
    } catch (error) {
      console.log("Error while deleting file", error);
    }
  };

  return (
    <div>
      <h1>Your Epub Files</h1>
      <button onClick={handleGoToLanding}>Back to landing page</button>
      {files.map((file, index) => (
        <div key={index}>
          <a href={file.url} target="_blank" rel="noopener noreferrer">Open</a>
          <button onClick={() => handleRead(file.url)}>Read</button>
          <button onClick={() => handleDelete(file.ref)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default EpubLibrary;

