import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Router } from "wouter";
import { FormModalButton } from "./form-modal-button";

describe("FormModalButton", () => {
  it("renders internal navigation as one anchor without a nested button", () => {
    const html = renderToStaticMarkup(
      <Router ssrPath="/">
        <FormModalButton label="Get a Quote" action="internal-link" href="/contact/" />
      </Router>,
    );

    expect(html).toMatch(/<a[^>]*href="\/contact\/"/);
    expect(html).not.toContain("<button");
  });

  it("normalizes persisted phone links and visible phone labels", () => {
    const html = renderToStaticMarkup(
      <FormModalButton
        label="Call (774) 329-7109"
        action="custom-link"
        href="tel:7743297109"
      />,
    );

    expect(html).toContain('href="tel:+17042771972"');
    expect(html).toContain("Call (704) 277-1972");
    expect(html).not.toContain("<button");
  });
});
