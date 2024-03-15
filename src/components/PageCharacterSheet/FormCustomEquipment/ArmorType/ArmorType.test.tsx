import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Form } from "antd";
import ArmorType from "./ArmorType";
import "@/support/setupTests.js";

describe("ArmorType", () => {
  it("renders without crashing", () => {
    const { getByText } = render(
      <Form>
        <ArmorType />
      </Form>,
    );
    expect(getByText("Light Armor")).to.exist;
    expect(getByText("Heavy Armor")).to.exist;
  });
});
