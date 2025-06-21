import { memo } from "react";
import { Handle, Position } from "reactflow";
import { Button } from "@/components/ui/button";
import { Entity } from "@shared/schema";
import { Edit, Trash2, Key, Type, Mail, Calendar, Hash, DollarSign, Info } from "lucide-react";

interface EntityNodeProps {
  data: Entity;
  selected: boolean;
}

function EntityNode({ data, selected }: EntityNodeProps) {
  const getAttributeIcon = (type: string, isPrimaryKey: boolean) => {
    if (isPrimaryKey) return <Key className="text-yellow-500" size={14} />;
    
    switch (type) {
      case "string":
        return <Type className="text-gray-400" size={14} />;
      case "int":
        return <Hash className="text-gray-400" size={14} />;
      case "decimal":
        return <DollarSign className="text-gray-400" size={14} />;
      case "datetime":
        return <Calendar className="text-gray-400" size={14} />;
      case "boolean":
        return <Info className="text-gray-400" size={14} />;
      default:
        return <Type className="text-gray-400" size={14} />;
    }
  };

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div 
        className={`bg-surface border-2 rounded-lg shadow-sm w-64 transition-colors cursor-move ${
          selected ? "border-primary" : "border-gray-300 hover:border-primary"
        }`}
      >
        <div className="bg-primary text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{data.name}</h3>
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white p-1">
                <Edit size={12} />
              </Button>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white p-1">
                <Trash2 size={12} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-3 space-y-2">
          {data.attributes.map((attribute) => (
            <div key={attribute.id} className="flex items-center text-sm">
              <div className="mr-2 w-4 flex justify-center">
                {getAttributeIcon(attribute.type, attribute.isPrimaryKey)}
              </div>
              <span className="font-mono text-gray-800">
                {attribute.name}: {attribute.type}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}

export default memo(EntityNode);
