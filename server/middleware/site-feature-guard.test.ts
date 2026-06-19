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

  it("keeps retired platform features disabled even when enabled in settings", async () => {
    mocks.getDecryptedCategory.mockResolvedValue({ enable_blog: "true" });
    const next = vi.fn();
    const res = createResponse();

    await requireSiteFeature("blogEnabled")({} as never, res as never, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Not found" });
  });

  it("returns 404 when a disabled-by-default feature is not enabled", async () => {
    mocks.getDecryptedCategory.mockResolvedValue({});
    const next = vi.fn();
    const res = createResponse();

    await requireSiteFeature("eventsEnabled")({} as never, res as never, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Not found" });
  });

  it("continues when a default-enabled feature has no stored setting", async () => {
    mocks.getDecryptedCategory.mockResolvedValue({});
    const next = vi.fn();
    const res = createResponse();

    await requireSiteFeature("crmEnabled")({} as never, res as never, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("fails closed for disabled-by-default features when settings cannot be read", async () => {
    mocks.getDecryptedCategory.mockRejectedValue(new Error("settings unavailable"));
    const next = vi.fn();
    const res = createResponse();

    await requireSiteFeature("directoryEnabled")({} as never, res as never, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(mocks.warn).toHaveBeenCalledWith(
      "Failed to resolve site feature flag",
      expect.objectContaining({ feature: "directoryEnabled" }),
    );
  });
});
