import React from "react";
import { Handle, Position } from "reactflow";

interface LeadSourceNodeProps {
  data: {
    sourceName: string;
    email: string;
    onChange: (field: string, value: string) => void;
  };
}

const LeadSourceNode: React.FC<LeadSourceNodeProps> = ({ data }) => {
  return (
    <div
      style={{
        padding: 10,
        border: "1px solid #ddd",
        borderRadius: 5,
        background: "#e0f7fa",
        width: 200,
      }}
    >
      <Handle type="source" position={Position.Bottom} />
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", marginBottom: 4 }}>
          Lead Source:
        </label>
        <input
          type="text"
          value={data.sourceName}
          onChange={(e) => data.onChange("sourceName", e.target.value)}
          style={{ width: "100%" }}
          placeholder="Source name"
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: 4 }}>
          Recipient Email:
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => data.onChange("email", e.target.value)}
          style={{ width: "100%" }}
          placeholder="recipient@example.com"
        />
      </div>
    </div>
  );
};

export default LeadSourceNode;
