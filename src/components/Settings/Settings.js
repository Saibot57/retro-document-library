import React from 'react';

const Settings = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="theme">
            Theme
          </label>
          <select id="theme" className="shadow border rounded w-full py-2 px-3 text-gray-700">
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="language">
            Language
          </label>
          <select id="language" className="shadow border rounded w-full py-2 px-3 text-gray-700">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>
        <button 
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Settings;
