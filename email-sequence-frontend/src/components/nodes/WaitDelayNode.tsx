import React from "react";
import { Handle, Position } from "reactflow";

interface WaitDelayNodeProps {
  data: {
    delayMinutes: number;
    onChange: (value: number) => void;
  };
  selected?: boolean;
}

const WaitDelayNode: React.FC<WaitDelayNodeProps> = ({ data, selected }) => {
  return (
    <div
      style={{
        padding: 16,
        border: `2px solid ${selected ? "#FF9800" : "#ddd"}`,
        borderRadius: 8,
        background: "#fff8e1",
        width: 200,
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "#FF9800",
          width: 10,
          height: 10,
          border: "2px solid white",
        }}
      />

      <div
        className="node-header"
        style={{
          marginBottom: 12,
          borderBottom: "1px solid #ffe0b2",
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#FF9800",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Wait / Delay
        </div>
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
          Wait (minutes):
        </label>
        <input
          type="number"
          min={1}
          value={data.delayMinutes}
          onChange={(e) => data.onChange(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 4,
            border: "1px solid #ffe0b2",
            fontSize: 14,
            transition: "border-color 0.2s",
            outline: "none",
            background: "white",
          }}
          onFocus={(e) => {
            const target = e.target as HTMLInputElement;
            target.style.borderColor = "#FF9800";
          }}
          onBlur={(e) => {
            const target = e.target as HTMLInputElement;
            target.style.borderColor = "#ffe0b2";
          }}
        />

        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "#666",
            fontStyle: "italic",
          }}
        >
          {data.delayMinutes === 1
            ? "Email will be sent after 1 minute"
            : `Email will be sent after ${data.delayMinutes} minutes`}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "#FF9800",
          width: 10,
          height: 10,
          border: "2px solid white",
        }}
      />
    </div>
  );
};

export default WaitDelayNode;
