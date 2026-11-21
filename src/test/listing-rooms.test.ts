import { describe, expect, it } from "vitest";

import { rooms } from "@/routes/listing";

describe("Property room pricing", () => {
  it("keeps a separate monthly price for each selectable room", () => {
    expect(rooms.map(({ id, price }) => ({ id, price }))).toEqual([
      { id: "aurora", price: 790 },
      { id: "linden", price: 850 },
      { id: "willow", price: 720 },
    ]);
  });
});
