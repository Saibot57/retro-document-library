import React, { useState } from 'react';
import { folderStructure } from '../../data/folderStructure';
import { FaFolder, FaFolderOpen } from 'react-icons/fa';
import { useFolderContext } from '../../context/FolderContext';

const FolderTree = ({ structure, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeFolder, setActiveFolder } = useFolderContext();

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleFolderClick = () => {
    toggleOpen();
    setActiveFolder(structure);
  };

  return (
    <div style={{ marginLeft: `${level * 20}px` }}>
      <div 
        onClick={handleFolderClick} 
        className={`flex items-center cursor-pointer hover:bg-gray-200 p-1 ${activeFolder === structure ? 'bg-blue-200' : ''}`}
      >
        {isOpen ? <FaFolderOpen className="mr-2" /> : <FaFolder className="mr-2" />}
        <span>{structure.name}</span>
      </div>
      {isOpen && structure.children.map((child, index) => (
        <FolderTree key={index} structure={child} level={level + 1} />
      ))}
    </div>
  );
};

const Sidebar = () => {
  return (
    <aside className="bg-gray-100 w-64 p-4 overflow-auto h-full">
      <h2 className="text-xl font-semibold mb-4">Folders</h2>
      <FolderTree structure={folderStructure} />
    </aside>
  );
};

export default Sidebar;