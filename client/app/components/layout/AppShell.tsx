import React, { useState } from 'react';
import { Menu, X, Home, Grid3X3, Settings, HelpCircle, Save, Share2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface AppShellProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
  topBarContent?: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ 
  children, 
  sidebarContent, 
  topBarContent 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [isSaved, setIsSaved] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSave = () => {
    setIsSaved(false);
    // Later Feature
    setTimeout(() => setIsSaved(true), 1000);
  };

  const handleShare = () => {
    // Later Feature
    console.log('Sharing project...');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <Home className="h-6 w-6 text-blue-600" />
            <div>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                placeholder="Project name"
              />
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className={`w-2 h-2 rounded-full ${isSaved ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span>{isSaved ? 'Saved' : 'Saving...'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {topBarContent}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            leftIcon={<Save className="h-4 w-4" />}
            loading={!isSaved}
          >
            Save
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            onClick={handleShare}
            leftIcon={<Share2 className="h-4 w-4" />}
          >
            Share
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 shadow-xl 
          transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900"
            >
            Design Tools
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-4 overflow-y-auto h-full">
            {sidebarContent || (
              <div className="space-y-4">
                <div className="text-center text-gray-500 py-8">
                  <Grid3X3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Sidebar content will appear here</p>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AppShell;
