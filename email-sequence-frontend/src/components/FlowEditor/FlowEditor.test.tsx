import { render, screen, fireEvent } from "@testing-library/react";
import FlowEditor from "./FlowEditor";

test("renders buttons and adds nodes", () => {
  render(<FlowEditor />);
  const addLeadSourceBtn = screen.getByText(/Add Lead Source/i);
  fireEvent.click(addLeadSourceBtn);
  expect(screen.getByPlaceholderText(/Lead Source/i)).toBeInTheDocument();
});
