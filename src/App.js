import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import Footer from './components/Footer/Footer';
import StartMenu from './components/StartMenu/StartMenu';
import Settings from './components/Settings/Settings';
import RecentFiles from './components/RecentFiles/RecentFiles';
import { FolderProvider } from './context/FolderContext';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showRecentFiles, setShowRecentFiles] = useState(false);

  return (
    <DndProvider backend={HTML5Backend}>
      <FolderProvider>
        <div className="flex flex-col h-screen bg-gray-100">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <MainContent />
          </div>
          <Footer />
          <StartMenu 
            onSettingsClick={() => setShowSettings(true)}
            onRecentFilesClick={() => setShowRecentFiles(true)}
          />
          {showSettings && <Settings onClose={() => setShowSettings(false)} />}
          {showRecentFiles && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg">
                <RecentFiles />
                <button
                  onClick={() => setShowRecentFiles(false)}
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          <ToastContainer position="bottom-right" />
        </div>
      </FolderProvider>
    </DndProvider>
  );
}

export default App;