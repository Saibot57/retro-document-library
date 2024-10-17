import React from 'react';
import { FaFile, FaFilePdf } from 'react-icons/fa';
import { useFolderContext } from '../../context/FolderContext';

const RecentFiles = () => {
  const { recentFiles } = useFolderContext();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Files</h2>
      <ul>
        {recentFiles.map((file, index) => (
          <li key={index} className="flex items-center mb-2">
            {file.name.endsWith('.pdf') ? 
              <FaFilePdf className="mr-2 text-red-500" /> : 
              <FaFile className="mr-2 text-blue-500" />
            }
            <span>{file.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentFiles;