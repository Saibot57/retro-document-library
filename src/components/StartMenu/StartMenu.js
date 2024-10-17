import React, { useState } from 'react';
import { FaHome, FaUpload, FaClock, FaCog } from 'react-icons/fa';
import { useFolderContext } from '../../context/FolderContext';

const StartMenu = ({ onSettingsClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setActiveFolder } = useFolderContext();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { 
      icon: <FaHome />, 
      text: 'Library Home', 
      action: () => {
        setActiveFolder(null);
        console.log('Navigated to Home');
      }
    },
    { 
      icon: <FaUpload />, 
      text: 'Upload File', 
      action: () => {
        console.log('Open upload dialog');
      }
    },
    { 
      icon: <FaClock />, 
      text: 'Recent Files', 
      action: () => {
        console.log('Show recent files');
      }
    },
    { 
      icon: <FaCog />, 
      text: 'Settings', 
      action: () => {
        onSettingsClick();
        console.log('Open settings');
      }
    },
  ];

  return (
    <div className="absolute bottom-0 left-0">
      <button
        onClick={toggleMenu}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-t-lg"
      >
        Start
      </button>
      {isOpen && (
        <div className="bg-gray-800 text-white p-4 rounded-tr-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Start Menu</h2>
          <ul>
            {menuItems.map((item, index) => (
              <li 
                key={index} 
                className="flex items-center mb-2 cursor-pointer hover:bg-gray-700 p-2 rounded"
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
              >
                <span className="mr-2">{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StartMenu;