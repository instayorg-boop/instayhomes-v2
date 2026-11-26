import { describe, expect, it } from "vitest";
import { promoByCode, promoStats, totalRooms, adminListings } from "@/lib/admin-sample";

describe("admin promo stats", () => {
  it("counts UNZA25 subscribers and revenue from its uses", () => {
    const s = promoStats(promoByCode("UNZA25")!);
    expect(s.subscribers).toBe(5);
    // 3 x K149 (K199 -25%) + 2 x K299 (K399 -25%)
    expect(s.revenueZMW).toBe(3 * 149 + 2 * 299);
  });
  it("totals a listing's rooms available across room types", () => {
    expect(totalRooms(adminListings[0]!)).toBe(6);
  });
});
