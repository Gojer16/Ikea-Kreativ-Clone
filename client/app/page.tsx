'use client';
import { useState } from 'react';
import AppShell from "./components/layout/AppShell";
import FurnitureSelector from "./components/FurnitureSelector";
import ImageUploader from "./components/ImageUploader";
import RoomTemplateSelector from "./components/RoomTemplateSelector";
import Scene from "./components/Scene";
import { Button } from "./components/ui/Button";
import { Upload, Grid3X3, Palette, Settings, Eye, Save } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'furniture' | 'templates' | 'upload'>('furniture');

  const sidebarContent = (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            leftIcon={<Save className="h-4 w-4" />}
            className="justify-start"
          >
            Save Project
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            leftIcon={<Eye className="h-4 w-4" />}
            className="justify-start"
          >
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            leftIcon={<Settings className="h-4 w-4" />}
            className="justify-start"
          >
            Settings
          </Button>
        </div>
      </div>

      {/* Design Tools */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Design Tools
        </h3>
        <div className="space-y-2">
          <Button
            variant={activeTab === 'furniture' ? 'primary' : 'ghost'}
            size="sm"
            fullWidth
            leftIcon={<Grid3X3 className="h-4 w-4" />}
            className="justify-start"
            onClick={() => setActiveTab('furniture')}
          >
            Furniture Library
          </Button>
          <Button
            variant={activeTab === 'templates' ? 'primary' : 'ghost'}
            size="sm"
            fullWidth
            leftIcon={<Palette className="h-4 w-4" />}
            className="justify-start"
            onClick={() => setActiveTab('templates')}
          >
            Room Templates
          </Button>
          <Button
            variant={activeTab === 'upload' ? 'primary' : 'ghost'}
            size="sm"
            fullWidth
            leftIcon={<Upload className="h-4 w-4" />}
            className="justify-start"
            onClick={() => setActiveTab('upload')}
          >
            Upload Image
          </Button>
        </div>
      </div>

      {/* Recent Items */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Recent Items
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>No recent items</p>
        </div>
      </div>
    </div>
  );

  const topBarContent = (
    <div className="flex items-center space-x-2">
      <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500">
        <span>Last saved:</span>
        <span className="font-medium">200000 minutes ago</span>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'furniture':
        return (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Furniture Library</h2>
              <p className="text-gray-600">Browse and add furniture to your room design</p>
            </div>
            <FurnitureSelector />
          </div>
        );
      
      case 'templates':
        return (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Room Templates</h2>
              <p className="text-gray-600">Choose from curated room layouts and styles</p>
            </div>
            <RoomTemplateSelector />
          </div>
        );
      
      case 'upload':
        return (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Room Image</h2>
              <p className="text-gray-600">Upload a photo of your room to get started</p>
            </div>
            <ImageUploader />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <AppShell sidebarContent={sidebarContent} topBarContent={topBarContent}>
      <div className="flex h-full">
        {/* Left Panel - Content */}
        <div className="w-96 border-r border-gray-200 bg-white overflow-y-auto">
          {renderContent()}
        </div>
        
        {/* Right Panel - 3D Scene */}
        <div className="flex-1 bg-gray-900">
          <div className="h-full">
            <Scene />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
