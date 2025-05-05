import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Edge,
  Node,
  NodeTypes,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Controls,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

import ColdEmailNode from "../nodes/ColdEmailNode";
import WaitDelayNode from "../nodes/WaitDelayNode";
import LeadSourceNode from "../nodes/LeadSourceNode";

import { scheduleFlow } from "../../api/flow";

// Define simple node types
const nodeTypes: NodeTypes = {
  coldEmail: ColdEmailNode,
  waitDelay: WaitDelayNode,
  leadSource: LeadSourceNode,
};

const FlowEditor: React.FC = () => {
  // Use any for node data to avoid complex type issues
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      // Create edge with arrow marker
      const newEdge = {
        ...params,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const addNode = (type: string) => {
    const id = `${type}_${Date.now()}`;
    let newNode: any;
    const yPosition = 5 + nodes.length * 100;

    switch (type) {
      case "coldEmail":
        newNode = {
          id,
          type,
          position: { x: 250, y: yPosition },
          data: {
            subject: "",
            body: "",
            onChange: (field: string, value: string) => {
              setNodes((nds: any) =>
                nds.map((node: any) => {
                  if (node.id === id) {
                    return {
                      ...node,
                      data: {
                        ...node.data,
                        [field]: value,
                        onChange: node.data.onChange,
                      },
                    };
                  }
                  return node;
                })
              );
            },
          },
        };
        break;

      case "waitDelay":
        newNode = {
          id,
          type,
          position: { x: 250, y: yPosition },
          data: {
            delayMinutes: 5,
            onChange: (value: number) => {
              setNodes((nds: any) =>
                nds.map((node: any) => {
                  if (node.id === id) {
                    return {
                      ...node,
                      data: {
                        ...node.data,
                        delayMinutes: value,
                        onChange: node.data.onChange,
                      },
                    };
                  }
                  return node;
                })
              );
            },
          },
        };
        break;

      case "leadSource":
        // Check if a lead source already exists
        const existingLeadSource = nodes.find(
          (node: any) => node.type === "leadSource"
        );
        if (existingLeadSource) {
          setMessage({
            text: "Only one Lead Source node is allowed",
            type: "error",
          });
          setTimeout(() => setMessage(null), 3000);
          return;
        }

        newNode = {
          id,
          type,
          position: { x: 250, y: yPosition },
          data: {
            sourceName: "",
            email: "",
            onChange: (field: string, value: string) => {
              setNodes((nds: any) =>
                nds.map((node: any) => {
                  if (node.id === id) {
                    return {
                      ...node,
                      data: {
                        ...node.data,
                        [field]: value,
                        onChange: node.data.onChange,
                      },
                    };
                  }
                  return node;
                })
              );
            },
          },
        };
        break;

      default:
        return;
    }

    setNodes((nds: any) => [...nds, newNode]);
  };

  const validateFlow = () => {
    // Check for lead source
    const leadSourceNode = nodes.find(
      (node: any) => node.type === "leadSource"
    );
    if (!leadSourceNode) {
      setMessage({
        text: "A Lead Source node is required",
        type: "error",
      });
      return false;
    }

    // Check if lead source has email
    if (!leadSourceNode.data.email) {
      setMessage({
        text: "Lead Source must have an email address",
        type: "error",
      });
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadSourceNode.data.email)) {
      setMessage({
        text: "Please enter a valid email address in Lead Source",
        type: "error",
      });
      return false;
    }

    // Check for at least one cold email
    const coldEmailNodes = nodes.filter(
      (node: any) => node.type === "coldEmail"
    );
    if (coldEmailNodes.length === 0) {
      setMessage({
        text: "At least one Cold Email node is required",
        type: "error",
      });
      return false;
    }

    // Check if all cold emails have subject and body
    for (const node of coldEmailNodes) {
      if (!node.data.subject || !node.data.body) {
        setMessage({
          text: "All Cold Email nodes must have subject and body",
          type: "error",
        });
        return false;
      }
    }

    // Check if there are connections between nodes
    if (edges.length === 0) {
      setMessage({
        text: "You need to connect your nodes to create a flow",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const saveAndSchedule = async () => {
    if (!validateFlow()) {
      return;
    }

    setLoading(true);
    try {
      // Convert nodes to the format expected by the API
      const flowNodes = nodes.map((node: any) => ({
        id: node.id,
        type: node.type || "",
        position: node.position,
        data: {
          ...node.data,
          // Remove the onChange function which can't be serialized
          onChange: undefined,
        },
      }));

      // Convert edges to the format expected by the API
      const flowEdges = edges.map((edge) => ({
        id: edge.id || "",
        source: edge.source,
        target: edge.target,
        type: edge.type,
      }));

      const response = await scheduleFlow(flowNodes, flowEdges);
      const emailCount = response.data?.scheduledEmails?.length || 0;

      setMessage({
        text: `Flow scheduled successfully! ${emailCount} emails will be sent.`,
        type: "success",
      });
    } catch (error: any) {
      console.error(error);
      setMessage({
        text:
          error.response?.data?.error ||
          "Failed to schedule flow. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div style={{ height: 700, display: "flex", flexDirection: "column" }}>
      <div
        style={{
          marginBottom: 10,
          padding: 10,
          background: "#f5f5f5",
          borderRadius: 5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <button
            onClick={() => addNode("leadSource")}
            style={{
              margin: "0 5px",
              padding: "8px 12px",
              background: "#e0f7fa",
              border: "1px solid #b2ebf2",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Add Lead Source
          </button>
          <button
            onClick={() => addNode("waitDelay")}
            style={{
              margin: "0 5px",
              padding: "8px 12px",
              background: "#f0f0f0",
              border: "1px solid #e0e0e0",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Add Wait/Delay
          </button>
          <button
            onClick={() => addNode("coldEmail")}
            style={{
              margin: "0 5px",
              padding: "8px 12px",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Add Cold Email
          </button>
        </div>
        <button
          onClick={saveAndSchedule}
          disabled={loading}
          style={{
            padding: "8px 16px",
            background: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Scheduling..." : "Save & Schedule Emails"}
        </button>
      </div>

      {message && (
        <div
          style={{
            padding: "10px 15px",
            marginBottom: 10,
            borderRadius: 4,
            background: message.type === "success" ? "#e8f5e9" : "#ffebee",
            color: message.type === "success" ? "#2e7d32" : "#c62828",
            border: `1px solid ${
              message.type === "success" ? "#a5d6a7" : "#ef9a9a"
            }`,
          }}
        >
          {message.text}
        </div>
      )}

      <div style={{ flex: 1, border: "1px solid #ddd", borderRadius: 5 }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      <div style={{ marginTop: 10, fontSize: 14, color: "#666" }}>
        <p>
          Instructions: Add a Lead Source (with recipient email), then add
          Wait/Delay nodes and Cold Email nodes. Connect them in sequence and
          click Save & Schedule.
        </p>
      </div>
    </div>
  );
};

export default FlowEditor;
