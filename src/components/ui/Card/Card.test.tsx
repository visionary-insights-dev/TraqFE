// src/components/ui/Card/Card.test.tsx
import { render, screen } from "@/test-utils";
import { Card, CardHeader, CardContent, CardFooter } from "./index";

describe("Card", () => {
  // Cards are the primary container for scholar-facing content; header/content/
  // footer subdivision keeps the structure meaningful for layout.
  it("renders header, content, and footer regions", () => {
    render(
      <Card>
        <CardHeader>Assignment Title</CardHeader>
        <CardContent>Description</CardContent>
        <CardFooter>Actions</CardFooter>
      </Card>
    );

    expect(screen.getByText("Assignment Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("applies a custom className", () => {
    render(<Card className="custom-card">Body</Card>);
    expect(screen.getByText("Body").closest(".custom-card")).toBeInTheDocument();
  });
});
