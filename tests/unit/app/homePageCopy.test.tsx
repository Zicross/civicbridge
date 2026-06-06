import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("ConstiuINT home page copy", () => {
  it("uses conservative intake language without claiming representative delivery", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: /ConstiuINT/i })).toBeInTheDocument();
    expect(screen.getByText("Find supported representatives")).toBeInTheDocument();
    expect(screen.getByText("Submit a message for ConstiuINT review")).toBeInTheDocument();
    expect(screen.queryByText(/send (a )?message to your representative/i)).not.toBeInTheDocument();
  });
});
