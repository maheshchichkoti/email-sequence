import React from "react";
import { Handle, Position } from "reactflow";

interface ColdEmailNodeProps {
  data: {
    subject: string;
    body: string;
    onChange: (field: string, value: string) => void;
  };
}

const ColdEmailNode: React.FC<ColdEmailNodeProps> = ({ data }) => {
  return (
    <div
      style={{
        padding: 10,
        border: "1px solid #ddd",
        borderRadius: 5,
        background: "#fff",
        width: 250,
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", marginBottom: 4 }}>
          Email Subject:
        </label>
        <input
          type="text"
          placeholder="Subject"
          value={data.subject}
          onChange={(e) => data.onChange("subject", e.target.value)}
          style={{ width: "100%", padding: "4px 8px" }}
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: 4 }}>Email Body:</label>
        <textarea
          placeholder="Email body"
          value={data.body}
          onChange={(e) => data.onChange("body", e.target.value)}
          style={{ width: "100%", height: 80, padding: "4px 8px" }}
        />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ColdEmailNode;
