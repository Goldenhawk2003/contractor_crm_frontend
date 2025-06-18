import { useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';

const LogoUploader = ({ onUpload }) => {
  const [fileName, setFileName] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFileName(file.name);
      onUpload(file); // send it to parent or backend logic
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  return (
    <div {...getRootProps()} className="logo-dropzone">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the logo here...</p>
      ) : fileName ? (
        <p>Uploaded: {fileName}</p>
      ) : (
        <p>Add Logo</p>
      )}
    </div>
  );
};

export default LogoUploader;