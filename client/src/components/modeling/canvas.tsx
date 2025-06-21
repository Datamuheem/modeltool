import { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  EdgeChange,
  NodeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import EntityNode from "./entity-node";
import { useModelingStore } from "@/lib/modeling-store";
import { Entity } from "@shared/schema";

const nodeTypes = {
  entity: EntityNode,
};

export default function Canvas() {
  const { currentProject, updateProject, addEntity, setSelectedEntity } = useModelingStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Convert entities to React Flow nodes - this will update when currentProject changes
  const reactFlowNodes: Node[] = currentProject?.modelData.entities.map((entity) => ({
    id: entity.id,
    type: "entity",
    position: entity.position,
    data: entity,
  })) || [];
  


  // Convert relationships to React Flow edges
  const reactFlowEdges: Edge[] = currentProject?.modelData.relationships.map((rel) => ({
    id: rel.id,
    source: rel.sourceEntityId,
    target: rel.targetEntityId,
    label: rel.label,
    type: "smoothstep",
    animated: true,
    style: { stroke: "#1976D2", strokeWidth: 2 },
  })) || [];

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update React Flow nodes and edges when project data changes
  useEffect(() => {
    setNodes(reactFlowNodes);
  }, [reactFlowNodes, setNodes]);

  useEffect(() => {
    setEdges(reactFlowEdges);
  }, [reactFlowEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type || !reactFlowBounds || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      if (type === "entity") {
        const newEntity: Entity = {
          id: `entity-${Date.now()}`,
          name: "NewEntity",
          position,
          attributes: [
            {
              id: `attr-${Date.now()}`,
              name: "id",
              type: "int",
              isPrimaryKey: true,
              isRequired: true,
              isUnique: true,
            },
          ],
        };

        addEntity(newEntity);
      }
    },
    [reactFlowInstance, addEntity]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedEntity(node.data);
    },
    [setSelectedEntity]
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      
      // Update entity positions in the store
      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          const entity = currentProject?.modelData.entities.find(e => e.id === change.id);
          if (entity && currentProject) {
            const updatedEntities = currentProject.modelData.entities.map(e =>
              e.id === change.id ? { ...e, position: change.position! } : e
            );
            
            updateProject({
              ...currentProject,
              modelData: {
                ...currentProject.modelData,
                entities: updatedEntities,
              },
            });
          }
        }
      });
    },
    [onNodesChange, currentProject, updateProject]
  );

  return (
    <div className="flex-1 relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Controls />
        <Background color="#6366f1" gap={20} />
      </ReactFlow>
      
      {/* Canvas Helper Text */}
      <div className="absolute bottom-4 left-4 text-gray-400 text-sm pointer-events-none">
        Drag components from the sidebar to create your data model
      </div>
    </div>
  );
}
