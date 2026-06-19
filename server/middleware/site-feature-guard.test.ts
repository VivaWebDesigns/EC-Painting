import { beforeEach, describe, expect, it, vi } from "vitest";
import { requireSiteFeature } from "./site-feature-guard";

const mocks = vi.hoisted(() => ({
  getDecryptedCategory: vi.fn(),
  warn: vi.fn(),
}));

vi.mock("../storage", () => ({
  storage: {
    settings: {
      getDecryptedCategory: mocks.getDecryptedCategory,
    },
  },
}));

vi.mock("../utils/logger", () => ({
  logger: {
    app: {
      warn: mocks.warn,
    },
  },
}));

function createResponse() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };
  res.status.mockReturnValue(res);
  return res;
}

describe("requireSiteFeature", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("continues when a default-enabled feature has no stored setting", async () => {
    mocks.getDecryptedCategory.mockResolvedValue({});
    const next = vi.fn();
    const res = createResponse();

    await requireSiteFeature("crmEnabled")({} as never, res as never, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("continues for CRM if settings cannot be read", async () => {
    mocks.getDecryptedCategory.mockRejectedValue(new Error("settings unavailable"));
    const next = vi.fn();
    const res = createResponse();

    await requireSiteFeature("crmEnabled")({} as never, res as never, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
    expect(mocks.warn).toHaveBeenCalledWith(
      "Failed to resolve site feature flag",
      expect.objectContaining({ feature: "crmEnabled" }),
    );
  });
});
