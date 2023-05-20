import React, { useState } from 'react';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import { Link } from 'react-router-dom';

function LandingPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const uid = auth.currentUser.uid;

    setUploading(true);
    const storageRef = ref(storage, `epub-files/${uid}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    console.log('Uploaded file:', downloadURL);
    setUploading(false);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div>
      <nav>
        <button onClick={handleLogout}>Logout</button>
        <button>EPUB Upload</button>
        <Link to="/library">Uploaded EPUBs</Link>
      </nav>

      <div>
        <h1>Upload an EPUB file</h1>
        <form onSubmit={handleUpload}>
          <input type="file" accept=".epub" onChange={handleFileChange} />
          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LandingPage;
