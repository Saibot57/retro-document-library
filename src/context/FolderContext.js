import React, { createContext, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { notify } from '../utils/notifications';

const FolderContext = createContext();

export const useFolderContext = () => useContext(FolderContext);

export const FolderProvider = ({ children }) => {
  const [folderData, setFolderData] = useState({
    id: 'root',
    name: 'Root',
    type: 'folder',
    children: [],
    tags: []
  });
  const [activeFolder, setActiveFolder] = useState(null);
  const [recentFiles, setRecentFiles] = useState([]);

  const addFileToFolder = (file, folderId) => {
    try {
      const newFile = { ...file, id: uuidv4(), tags: [] };
      setFolderData(prevData => {
        const updatedData = JSON.parse(JSON.stringify(prevData));
        const addFile = (folder) => {
          if (folder.id === folderId) {
            folder.children = [...(folder.children || []), newFile];
            return true;
          }
          return folder.children && folder.children.some(addFile);
        };
        addFile(updatedData);
        return updatedData;
      });
      addRecentFile(newFile);
      notify.success(`File "${file.name}" added successfully`);
    } catch (error) {
      console.error('Error adding file:', error);
      notify.error(`Failed to add file "${file.name}"`);
    }
  };

  const addRecentFile = (file) => {
    try {
      setRecentFiles(prev => [file, ...prev.filter(f => f.id !== file.id)].slice(0, 10));
    } catch (error) {
      console.error('Error adding recent file:', error);
      notify.error(`Failed to update recent files`);
    }
  };

  const addTag = (itemId, tag) => {
    try {
      setFolderData(prevData => {
        const updatedData = JSON.parse(JSON.stringify(prevData));
        const addTagToItem = (item) => {
          if (item.id === itemId) {
            item.tags = [...new Set([...(item.tags || []), tag])];
            return true;
          }
          return item.children && item.children.some(addTagToItem);
        };
        addTagToItem(updatedData);
        return updatedData;
      });
      notify.success(`Tag "${tag}" added successfully`);
    } catch (error) {
      console.error('Error adding tag:', error);
      notify.error(`Failed to add tag "${tag}"`);
    }
  };

  const removeTag = (itemId, tag) => {
    try {
      setFolderData(prevData => {
        const updatedData = JSON.parse(JSON.stringify(prevData));
        const removeTagFromItem = (item) => {
          if (item.id === itemId) {
            item.tags = (item.tags || []).filter(t => t !== tag);
            return true;
          }
          return item.children && item.children.some(removeTagFromItem);
        };
        removeTagFromItem(updatedData);
        return updatedData;
      });
      notify.success(`Tag "${tag}" removed successfully`);
    } catch (error) {
      console.error('Error removing tag:', error);
      notify.error(`Failed to remove tag "${tag}"`);
    }
  };

  const renameItem = (itemId, newName) => {
    try {
      setFolderData(prevData => {
        const updatedData = JSON.parse(JSON.stringify(prevData));
        const renameItemInData = (item) => {
          if (item.id === itemId) {
            item.name = newName;
            return true;
          }
          return item.children && item.children.some(renameItemInData);
        };
        renameItemInData(updatedData);
        return updatedData;
      });
      notify.success(`Item renamed to "${newName}" successfully`);
    } catch (error) {
      console.error('Error renaming item:', error);
      notify.error(`Failed to rename item to "${newName}"`);
    }
  };

  const deleteItem = (itemId) => {
    try {
      setFolderData(prevData => {
        const updatedData = JSON.parse(JSON.stringify(prevData));
        const deleteItemFromData = (parent) => {
          const index = parent.children.findIndex(child => child.id === itemId);
          if (index !== -1) {
            parent.children.splice(index, 1);
            return true;
          }
          return parent.children.some(child => deleteItemFromData(child));
        };
        deleteItemFromData(updatedData);
        return updatedData;
      });
      notify.success(`Item deleted successfully`);
    } catch (error) {
      console.error('Error deleting item:', error);
      notify.error(`Failed to delete item`);
    }
  };

  return (
    <FolderContext.Provider value={{
      folderData,
      setFolderData,
      activeFolder,
      setActiveFolder,
      addFileToFolder,
      recentFiles,
      addTag,
      removeTag,
      renameItem,
      deleteItem
    }}>
      {children}
    </FolderContext.Provider>
  );
};
