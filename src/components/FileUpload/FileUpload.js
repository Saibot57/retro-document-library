import React, { useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { useFolderContext } from '../../context/FolderContext';
import { v4 as uuidv4 } from 'uuid';
import { notify } from '../../utils/notifications';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const { activeFolder, addFileToFolder, updateFileContent } = useFolderContext();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file || !activeFolder) return;
    
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const fileId = uuidv4();
        const newFile = {
          id: fileId,
          name: file.name,
          type: 'file',
          size: file.size,
          lastModified: file.lastModified
        };
        
        addFileToFolder(newFile, activeFolder.id);
        updateFileContent(fileId, content);
        
        notify.success(`File "${file.name}" uploaded successfully`);
        
        setFile(null);
        event.target.reset();
      };
      reader.onerror = () => {
        throw new Error('File reading failed');
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      notify.error(`Failed to upload file "${file.name}"`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex items-center">
        <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
          <FaUpload className="mr-2" />
          <span>Choose File</span>
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
        <span className="ml-2">{file ? file.name : 'No file chosen'}</span>
      </div>
      <button 
        type="submit" 
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        disabled={!file || !activeFolder}
      >
        Upload to {activeFolder?.name || 'root'}
      </button>
    </form>
  );
};

export default FileUpload;