import { useRef } from 'react';
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ProfilePictureUploader({ userId, photoURL, setPhotoURL }) {
  const fileInputRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileRef = ref(storage, `profile_pictures/${userId}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    setPhotoURL(url);
    alert('Photo uploaded!');
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Profile Photo</h2>
      {photoURL && <img src={photoURL} alt="Profile" className="w-32 h-32 rounded-full mb-2 object-cover" />}
      <input type="file" onChange={handleUpload} ref={fileInputRef} />
    </div>
  );
}
