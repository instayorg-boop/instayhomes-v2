import { describe, expect, it } from "vitest";

import { rooms, totalAvailableRooms } from "@/routes/listing";

describe("Property room pricing", () => {
  it("keeps a separate monthly price for each selectable room", () => {
    expect(rooms.map(({ id, price }) => ({ id, price }))).toEqual([
      { id: "aurora", price: 790 },
      { id: "linden", price: 850 },
      { id: "willow", price: 720 },
    ]);
  });

  it("gives every room its own three-photo gallery", () => {
    expect(rooms.map(({ id, images }) => ({ id, photoCount: images.length }))).toEqual([
      { id: "aurora", photoCount: 3 },
      { id: "linden", photoCount: 3 },
      { id: "willow", photoCount: 3 },
    ]);

    const photoSources = rooms.flatMap((room) => room.images.map((photo) => photo.src));
    expect(new Set(photoSources).size).toBe(9);
  });

  it("tracks availability per room type and totals it for the property", () => {
    expect(rooms.map(({ id, availableRooms }) => ({ id, availableRooms }))).toEqual([
      { id: "aurora", availableRooms: 3 },
      { id: "linden", availableRooms: 2 },
      { id: "willow", availableRooms: 1 },
    ]);
    expect(totalAvailableRooms).toBe(6);
  });
});
