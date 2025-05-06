import React from "react";
import { Handle, Position } from "reactflow";

interface LeadSourceNodeProps {
  data: {
    sourceName: string;
    email: string;
    onChange: (field: string, value: string) => void;
  };
  selected?: boolean;
}

const LeadSourceNode: React.FC<LeadSourceNodeProps> = ({ data, selected }) => {
  return (
    <div
      style={{
        padding: 16,
        border: `2px solid ${selected ? "#4CAF50" : "#ddd"}`,
        borderRadius: 8,
        background: "#e8f5e9",
        width: 240,
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease",
      }}
    >
      <div
        className="node-header"
        style={{
          marginBottom: 12,
          borderBottom: "1px solid #c8e6c9",
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#4CAF50",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Lead Source
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 14,
            fontWeight: 500,
            color: "#333",
          }}
        >
          Lead Source:
        </label>
        <input
          type="text"
          value={data.sourceName}
          onChange={(e) => data.onChange("sourceName", e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 4,
            border: "1px solid #c8e6c9",
            fontSize: 14,
            transition: "border-color 0.2s",
            outline: "none",
            background: "white",
          }}
          placeholder="Source name"
          onFocus={(e) => {
            const target = e.target as HTMLInputElement;
            target.style.borderColor = "#4CAF50";
          }}
          onBlur={(e) => {
            const target = e.target as HTMLInputElement;
            target.style.borderColor = "#c8e6c9";
          }}
        />
      </div>

      <div>
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 14,
            fontWeight: 500,
            color: "#333",
          }}
        >
          Recipient Email:
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => data.onChange("email", e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 4,
            border: "1px solid #c8e6c9",
            fontSize: 14,
            transition: "border-color 0.2s",
            outline: "none",
            background: "white",
          }}
          placeholder="recipient@example.com"
          onFocus={(e) => {
            const target = e.target as HTMLInputElement;
            target.style.borderColor = "#4CAF50";
          }}
          onBlur={(e) => {
            const target = e.target as HTMLInputElement;
            target.style.borderColor = "#c8e6c9";
          }}
        />
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "#4CAF50",
          width: 10,
          height: 10,
          border: "2px solid white",
        }}
      />
    </div>
  );
};

export default LeadSourceNode;
