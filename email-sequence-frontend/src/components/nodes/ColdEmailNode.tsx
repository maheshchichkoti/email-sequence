import React from "react";
import { Handle, Position } from "reactflow";

interface ColdEmailNodeProps {
  data: {
    subject: string;
    body: string;
    onChange: (field: string, value: string) => void;
  };
  selected?: boolean;
}

const ColdEmailNode: React.FC<ColdEmailNodeProps> = ({ data, selected }) => {
  return (
    <div
      style={{
        padding: 16,
        border: `2px solid ${selected ? "#2196F3" : "#ddd"}`,
        borderRadius: 8,
        background: "#fff",
        width: 280,
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "#2196F3",
          width: 10,
          height: 10,
          border: "2px solid white",
        }}
      />

      <div
        className="node-header"
        style={{
          marginBottom: 12,
          borderBottom: "1px solid #eee",
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#2196F3",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Cold Email
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
          Email Subject:
        </label>
        <input
          type="text"
          placeholder="Enter email subject line"
          value={data.subject}
          onChange={(e) => data.onChange("subject", e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 4,
            border: "1px solid #ddd",
            fontSize: 14,
            transition: "border-color 0.2s",
            outline: "none",
          }}
          onFocus={(e) => {
            const target = e.target as HTMLInputElement;
            target.style.borderColor = "#2196F3";
          }}
          onBlur={(e) => {
            const target = e.target as HTMLInputElement;
            target.style.borderColor = "#ddd";
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
          Email Body:
        </label>
        <textarea
          placeholder="Write your email content here..."
          value={data.body}
          onChange={(e) => data.onChange("body", e.target.value)}
          style={{
            width: "100%",
            height: 100,
            padding: "8px 12px",
            borderRadius: 4,
            border: "1px solid #ddd",
            fontSize: 14,
            resize: "vertical",
            fontFamily: "inherit",
            transition: "border-color 0.2s",
            outline: "none",
          }}
          onFocus={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.borderColor = "#2196F3";
          }}
          onBlur={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.borderColor = "#ddd";
          }}
        />
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "#2196F3",
          width: 10,
          height: 10,
          border: "2px solid white",
        }}
      />
    </div>
  );
};

export default ColdEmailNode;
