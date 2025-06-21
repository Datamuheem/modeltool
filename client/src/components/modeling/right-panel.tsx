import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModelingStore } from "@/lib/modeling-store";
import { generatePythonCode } from "@/lib/code-generator";
import { Plus, Trash2 } from "lucide-react";
import { Attribute } from "@shared/schema";

export default function RightPanel() {
  const { selectedEntity, updateEntity, currentProject } = useModelingStore();
  const [activeTab, setActiveTab] = useState("properties");

  const addAttribute = () => {
    if (!selectedEntity) return;

    const newAttribute: Attribute = {
      id: `attr-${Date.now()}`,
      name: "new_field",
      type: "string",
      isPrimaryKey: false,
      isRequired: false,
      isUnique: false,
    };

    updateEntity({
      ...selectedEntity,
      attributes: [...selectedEntity.attributes, newAttribute],
    });
  };

  const updateAttribute = (attributeId: string, updates: Partial<Attribute>) => {
    if (!selectedEntity) return;

    const updatedAttributes = selectedEntity.attributes.map(attr =>
      attr.id === attributeId ? { ...attr, ...updates } : attr
    );

    updateEntity({
      ...selectedEntity,
      attributes: updatedAttributes,
    });
  };

  const deleteAttribute = (attributeId: string) => {
    if (!selectedEntity) return;

    const filteredAttributes = selectedEntity.attributes.filter(attr => attr.id !== attributeId);
    updateEntity({
      ...selectedEntity,
      attributes: filteredAttributes,
    });
  };

  const updateEntityField = (field: string, value: any) => {
    if (!selectedEntity) return;

    updateEntity({
      ...selectedEntity,
      [field]: value,
    });
  };

  const generatedCode = currentProject ? generatePythonCode(currentProject.modelData.entities) : "";

  return (
    <div className="w-80 bg-surface border-l border-gray-200 flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="flex-1 overflow-auto p-4">
          {selectedEntity ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Entity Properties</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                    <Input
                      value={selectedEntity.name}
                      onChange={(e) => updateEntityField("name", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Table Name</label>
                    <Input
                      value={selectedEntity.tableName || ""}
                      onChange={(e) => updateEntityField("tableName", e.target.value)}
                      placeholder="Database table name"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <Textarea
                      value={selectedEntity.description || ""}
                      onChange={(e) => updateEntityField("description", e.target.value)}
                      placeholder="Entity description..."
                      rows={3}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Attributes</h3>
                  <Button size="sm" onClick={addAttribute}>
                    <Plus className="mr-1" size={14} />
                    Add
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {selectedEntity.attributes.map((attribute) => (
                    <div key={attribute.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Input
                          value={attribute.name}
                          onChange={(e) => updateAttribute(attribute.id, { name: e.target.value })}
                          className="font-mono text-sm border-0 p-0 focus:ring-0 flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAttribute(attribute.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                        <Select
                          value={attribute.type}
                          onValueChange={(value: any) => updateAttribute(attribute.id, { type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="int">int</SelectItem>
                            <SelectItem value="string">string</SelectItem>
                            <SelectItem value="decimal">decimal</SelectItem>
                            <SelectItem value="datetime">datetime</SelectItem>
                            <SelectItem value="boolean">boolean</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-4 text-xs">
                        <label className="flex items-center space-x-1">
                          <Checkbox
                            checked={attribute.isPrimaryKey}
                            onCheckedChange={(checked) => 
                              updateAttribute(attribute.id, { isPrimaryKey: checked as boolean })
                            }
                          />
                          <span>Primary Key</span>
                        </label>
                        <label className="flex items-center space-x-1">
                          <Checkbox
                            checked={attribute.isRequired}
                            onCheckedChange={(checked) => 
                              updateAttribute(attribute.id, { isRequired: checked as boolean })
                            }
                          />
                          <span>Required</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <p>Select an entity to edit its properties</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="code" className="flex-1 overflow-auto p-4">
          <div className="h-full">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Generated Python Code</h3>
            <pre className="bg-gray-100 p-4 rounded-lg text-xs font-mono overflow-auto h-full whitespace-pre-wrap">
              {generatedCode || "No entities to generate code for."}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="flex-1 flex flex-col">
          <div className="p-4 text-center text-gray-500">
            <p>AI Chat functionality will be available in the floating chatbot.</p>
            <p className="text-xs mt-2">Click the "AI Assistant" button in the top toolbar.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
