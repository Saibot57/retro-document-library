import React, { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { FaFile, FaFilePdf, FaTag } from 'react-icons/fa';
import FileUpload from '../FileUpload/FileUpload';
import PDFViewer from '../PDFViewer/PDFViewer';
import Search from '../Search/Search';
import { useFolderContext } from '../../context/FolderContext';
import { notify } from '../../utils/notifications';

const MainContent = () => {
  const { 
    activeFolder, 
    folderData, 
    addFileToFolder, 
    addTag, 
    removeTag, 
    renameItem, 
    deleteItem 
  } = useFolderContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [filterTag, setFilterTag] = useState('');
  const fileInputRef = useRef(null);

  const [, drop] = useDrop({
    accept: 'FILE',
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      addFileToFolder(item, activeFolder.id);
    },
  });

  const findFolderFiles = (folder) => {
    if (folder.id === activeFolder?.id) {
      return folder.children || [];
    }
    if (folder.children) {
      for (let child of folder.children) {
        const result = findFolderFiles(child);
        if (result) return result;
      }
    }
    return null;
  };

  const files = searchResults || (activeFolder ? findFolderFiles(folderData) : []);

  const filteredFiles = filterTag
    ? files.filter(file => file.tags && file.tags.includes(filterTag))
    : files;

  const handleFileClick = (file) => {
    if (file.name.endsWith('.pdf')) {
      setSelectedFile(file);
    } else {
      console.log('Clicked on non-PDF file:', file.name);
    }
  };

  const handleUploadClick = () => {
    setShowUpload(true);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSearch = (query) => {
    const results = searchFiles(query, folderData);
    setSearchResults(results);
  };

  const searchFiles = (query, folder) => {
    let results = [];
    if (folder.children) {
      results = folder.children.filter(file => 
        file.name.toLowerCase().includes(query.toLowerCase())
      );
      folder.children.forEach(child => {
        if (child.type === 'folder') {
          results = [...results, ...searchFiles(query, child)];
        }
      });
    }
    return results;
  };

  const handleAddTag = (file, tag) => {
    try {
      addTag(file.id, tag);
      notify.success(`Tag "${tag}" added to "${file.name}"`);
    } catch (error) {
      console.error('Error adding tag:', error);
      notify.error(`Failed to add tag "${tag}" to "${file.name}"`);
    }
  };

  const handleRemoveTag = (file, tag) => {
    try {
      removeTag(file.id, tag);
      notify.success(`Tag "${tag}" removed from "${file.name}"`);
    } catch (error) {
      console.error('Error removing tag:', error);
      notify.error(`Failed to remove tag "${tag}" from "${file.name}"`);
    }
  };

  const handleRename = (file, newName) => {
    try {
      renameItem(file.id, newName);
      notify.success(`File renamed to "${newName}"`);
    } catch (error) {
      console.error('Error renaming file:', error);
      notify.error(`Failed to rename file "${file.name}"`);
    }
  };

  const handleDelete = (file) => {
    try {
      deleteItem(file.id);
      notify.success(`File "${file.name}" deleted`);
    } catch (error) {
      console.error('Error deleting file:', error);
      notify.error(`Failed to delete file "${file.name}"`);
    }
  };

  return (
    <main ref={drop} className="flex-1 p-4 overflow-auto bg-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {activeFolder ? `Contents of ${activeFolder.name}` : 'Library Home'}
      </h2>
      <Search onSearch={handleSearch} />{showUpload && <FileUpload ref={fileInputRef} />}
      <button 
        onClick={handleUploadClick}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 ease-in-out"
      >
        Upload File
      </button>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by tag"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file, index) => (
          <div 
            key={index} 
            className="flex flex-col p-3 bg-white rounded-lg shadow-md"
          >
            <div 
              className="flex items-center cursor-pointer hover:bg-gray-50 transition duration-300 ease-in-out"
              onClick={() => handleFileClick(file)}
            >
              {file.name.endsWith('.pdf') ? 
                <FaFilePdf className="mr-3 text-red-500 text-xl" /> : 
                <FaFile className="mr-3 text-blue-500 text-xl" />
              }
              <span className="text-gray-700">{file.name}</span>
            </div>
            <div className="mt-2 flex flex-wrap">
              {file.tags && file.tags.map((tag, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded flex items-center">
                  <FaTag className="mr-1" />
                  {tag}
                  <button onClick={() => handleRemoveTag(file, tag)} className="ml-1 text-red-500">&times;</button>
                </span>
              ))}
            </div>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Add tag"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag(file, e.target.value);
                    e.target.value = '';
                  }
                }}
                className="px-2 py-1 border rounded"
              />
            </div>
            <div className="mt-2 flex justify-between">
              <button
                onClick={() => {
                  const newName = prompt('Enter new name', file.name);
                  if (newName) handleRename(file, newName);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                Rename
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this file?')) {
                    handleDelete(file);
                  }
                }}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedFile && selectedFile.name.endsWith('.pdf') && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">PDF Preview: {selectedFile.name}</h3>
          <PDFViewer file={selectedFile} />
        </div>
      )}
    </main>
  );
};

export default MainContent;