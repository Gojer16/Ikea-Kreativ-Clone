'use client';
import { useState } from 'react';
import AppShell from "./components/layout/AppShell";
import FurnitureSelector from "./components/FurnitureSelector";
import ImageUploader from "./components/ImageUploader";
import RoomTemplateSelector from "./components/RoomTemplateSelector";
import Scene from "./components/Scene";
import { Button } from "./components/ui/Button";
import { Upload, Grid3X3, Palette, Settings, Eye, Save, Share2, Camera, Download, RotateCcw, RotateCw, Maximize2, Zap } from 'lucide-react';
import { useFurnitureStore } from "./store/useFurnitureStore";
import { useUiStore } from "./store/useUiStore";
import { useSelectionStore } from "./store/useSelectionStore";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'furniture' | 'templates' | 'upload'>('furniture');
  const placed = useFurnitureStore((s) => s.placed);
  const available = useFurnitureStore((s) => s.available);
  const clearAll = useFurnitureStore((s) => s.clearAll);
  const loadFromSerialized = useFurnitureStore((s) => s.loadFromSerialized);
  const clearSelection = useSelectionStore((s) => s.clearSelection);
  const canUndo = useFurnitureStore((s) => s.canUndo());
  const canRedo = useFurnitureStore((s) => s.canRedo());
  const undo = useFurnitureStore((s) => s.undo);
  const redo = useFurnitureStore((s) => s.redo);
  const captureScreenshot = useUiStore((s) => s.captureScreenshot);
  const runFitToScene = useUiStore((s) => s.runFitToScene);
  const performanceOverlay = useUiStore((s) => s.performanceOverlay);
  const togglePerformanceOverlay = useUiStore((s) => s.togglePerformanceOverlay);
  const runCameraPreset = useUiStore((s) => s.runCameraPreset);

  const sidebarContent = (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" leftIcon={<RotateCcw className="h-4 w-4" />} disabled={!canUndo} onClick={undo}>Undo</Button>
            <Button variant="outline" size="sm" leftIcon={<RotateCw className="h-4 w-4" />} disabled={!canRedo} onClick={redo}>Redo</Button>
            <Button variant="outline" size="sm" leftIcon={<Camera className="h-4 w-4" />} onClick={() => {
              const dataUrl = captureScreenshot();
              if (!dataUrl) return;
              const a = document.createElement('a');
              a.href = dataUrl;
              a.download = 'room.png';
              a.click();
            }}>Screenshot</Button>
            <Button variant="outline" size="sm" leftIcon={<Maximize2 className="h-4 w-4" />} onClick={runFitToScene}>Fit</Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="ghost" size="sm" onClick={() => runCameraPreset('front')}>Front</Button>
            <Button variant="ghost" size="sm" onClick={() => runCameraPreset('left')}>Left</Button>
            <Button variant="ghost" size="sm" onClick={() => runCameraPreset('iso')}>Iso</Button>
            <Button variant="ghost" size="sm" onClick={() => runCameraPreset('reset')}>Reset</Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            leftIcon={<Save className="h-4 w-4" />}
            className="justify-start"
            onClick={() => {
              try {
                const serialized = {
                  placed: placed.map(p => ({
                    instanceId: p.instanceId,
                    catalogId: p.catalogId,
                    position: p.position,
                    rotation: p.rotation,
                  }))
                };
                localStorage.setItem('furniture-state', JSON.stringify(serialized));
              } catch {}
            }}
          >
          Save Project
          </Button>
          {/* BOM Subtotal */}
          <div className="text-sm text-gray-700 flex items-center justify-between">
            <span>Subtotal</span>
            <span className="font-semibold">${placed.reduce((sum, p) => {
              const item = available.find(a => a.id === p.catalogId);
              return sum + (item?.price || 0);
            }, 0).toLocaleString()}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            leftIcon={<Download className="h-4 w-4" />}
            className="justify-start"
            onClick={() => {
              const rows = [['Item','Qty','Unit Price','Total']];
              const counts: Record<string, number> = {};
              placed.forEach(p => { counts[p.catalogId] = (counts[p.catalogId] || 0) + 1; });
              Object.entries(counts).forEach(([catalogId, qty]) => {
                const item = available.find(a => a.id === catalogId);
                const name = item?.name || catalogId;
                const price = item?.price || 0;
                rows.push([name, String(qty), String(price), String(price * qty)]);
              });
              const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'bill_of_materials.csv';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
          Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            leftIcon={<Share2 className="h-4 w-4" />}
            className="justify-start"
            onClick={() => {
              try {
                const serialized = {
                  placed: placed.map(p => ({
                    instanceId: p.instanceId,
                    catalogId: p.catalogId,
                    position: p.position,
                    rotation: p.rotation,
                  }))
                };
                const json = encodeURIComponent(JSON.stringify(serialized));
                const url = `${window.location.origin}?s=${json}`;
                navigator.clipboard.writeText(url);
              } catch {}
            }}
          >
          Copy Share Link
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            leftIcon={<Download className="h-4 w-4" />}
            className="justify-start"
            onClick={() => {
              const serialized = {
                placed: placed.map(p => ({
                  instanceId: p.instanceId,
                  catalogId: p.catalogId,
                  position: p.position,
                  rotation: p.rotation,
                }))
              };
              const blob = new Blob([JSON.stringify(serialized, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'room.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
          Download JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            leftIcon={<Eye className="h-4 w-4" />}
            className="justify-start"
            onClick={() => {
              try {
                const raw = localStorage.getItem('furniture-state');
                if (!raw) return;
                const parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed.placed)) {
                  loadFromSerialized({ placed: parsed.placed });
                  clearSelection();
                }
              } catch {}
            }}
          >
          Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            leftIcon={<Settings className="h-4 w-4" />}
            className="justify-start"
            onClick={() => {
              clearAll();
              clearSelection();
            }}
          >
          Reset Scene
          </Button>
          <Button
            variant={performanceOverlay ? 'primary' : 'outline'}
            size="sm"
            fullWidth
            leftIcon={<Zap className="h-4 w-4" />}
            className="justify-start"
            onClick={togglePerformanceOverlay}
          >
            {performanceOverlay ? 'Performance: On' : 'Performance: Off'}
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
        <div className="flex-1 bg-gray-800">
          <div className="h-full">
            <Scene />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
