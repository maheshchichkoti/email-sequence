import React from "react";
import { Handle, Position } from "reactflow";

interface WaitDelayNodeProps {
  data: {
    delayMinutes: number;
    onChange: (value: number) => void;
  };
}

const WaitDelayNode: React.FC<WaitDelayNodeProps> = ({ data }) => {
  return (
    <div
      style={{
        padding: 10,
        border: "1px solid #ddd",
        borderRadius: 5,
        background: "#f0f0f0",
        width: 180,
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div>
        <label style={{ display: "block", marginBottom: 4 }}>
          Wait (minutes):
        </label>
        <input
          type="number"
          min={1}
          value={data.delayMinutes}
          onChange={(e) => data.onChange(Number(e.target.value))}
          style={{ width: "100%", padding: "4px 8px" }}
        />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default WaitDelayNode;
