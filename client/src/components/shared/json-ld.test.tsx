// @vitest-environment jsdom

import React, { act } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { JsonLd } from "@/components/shared/json-ld";

describe("JsonLd", () => {
  let container: HTMLDivElement;
  let root: Root | null = null;

  beforeEach(() => {
    (globalThis as typeof globalThis & { React?: typeof React; IS_REACT_ACT_ENVIRONMENT?: boolean }).React = React;
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    root = null;
    container.remove();
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
      script.remove();
    });
  });

  it("reuses equivalent server-rendered schema instead of inserting a duplicate", async () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://ecpaintingcharlotte.com/",
        },
      ],
    };
    const serverScript = document.createElement("script");
    serverScript.type = "application/ld+json";
    serverScript.textContent = JSON.stringify(schema);
    document.head.appendChild(serverScript);
    root = createRoot(container);

    await act(async () => {
      root!.render(<JsonLd schemas={[schema]} />);
    });

    expect(document.head.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
  });
});
