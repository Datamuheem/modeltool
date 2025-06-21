import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useModelingStore } from "@/lib/modeling-store";
import { 
  Undo2, 
  Redo2, 
  ZoomOut, 
  ZoomIn, 
  Grid3X3, 
  CheckCircle,
  Bot
} from "lucide-react";

export default function TopToolbar() {
  const { currentProject } = useModelingStore();
  const [showGrid, setShowGrid] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(50, prev - 25));
  };

  const toggleChatbot = () => {
    setShowChatbot(prev => !prev);
    // Emit event for chatbot component to listen to
    window.dispatchEvent(new CustomEvent('toggleChatbot', { detail: { show: !showChatbot } }));
  };

  return (
    <div className="bg-surface border-b border-gray-200 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" title="Undo">
              <Undo2 className="text-gray-600" size={16} />
            </Button>
            <Button variant="ghost" size="sm" title="Redo">
              <Redo2 className="text-gray-600" size={16} />
            </Button>
          </div>
          
          <div className="w-px h-6 bg-gray-300"></div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleZoomOut} title="Zoom Out">
              <ZoomOut className="text-gray-600" size={16} />
            </Button>
            <span className="text-sm text-gray-600 min-w-12 text-center">{zoomLevel}%</span>
            <Button variant="ghost" size="sm" onClick={handleZoomIn} title="Zoom In">
              <ZoomIn className="text-gray-600" size={16} />
            </Button>
          </div>
          
          <div className="w-px h-6 bg-gray-300"></div>
          
          <Button
            variant={showGrid ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            className="flex items-center space-x-2"
          >
            <Grid3X3 className="text-gray-600" size={16} />
            <span>Grid</span>
          </Button>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Validation Status */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
            <CheckCircle className="text-green-500" size={16} />
            <span>Valid Model</span>
          </div>
          
          {/* AI Assistant Toggle */}
          <Button
            onClick={toggleChatbot}
            className="flex items-center space-x-2 bg-accent text-white hover:bg-orange-600"
          >
            <Bot size={16} />
            <span>AI Assistant</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
