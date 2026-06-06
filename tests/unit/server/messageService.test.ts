import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitMessage } from "../../../src/server/services/messageService";
import * as authConfig from "../../../src/server/auth/config";
import * as rateLimit from "../../../src/server/rateLimit";

describe("messageService.submitMessage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("throws when user is unauthenticated", () => {
    vi.spyOn(authConfig, "getCurrentUser").mockReturnValue(null);
    expect(() =>
      submitMessage({
        issueCategory: "housing",
        body: "Test message",
        consentAccepted: true,
      })
    ).toThrow("Unauthenticated");
  });

  it("throws when user email is not verified", () => {
    vi.spyOn(authConfig, "getCurrentUser").mockReturnValue({
      id: "user-1",
      email: "test@example.com",
      emailVerified: false,
    });
    expect(() =>
      submitMessage({
        issueCategory: "housing",
        body: "Test message",
        consentAccepted: true,
      })
    ).toThrow("Email not verified");
  });

  it("throws when consent is not accepted", () => {
    vi.spyOn(authConfig, "getCurrentUser").mockReturnValue({
      id: "user-1",
      email: "test@example.com",
      emailVerified: true,
    });
    expect(() =>
      submitMessage({
        issueCategory: "housing",
        body: "Test message",
        consentAccepted: false,
      })
    ).toThrow("consent");
  });

  it("throws when issue category is missing", () => {
    vi.spyOn(authConfig, "getCurrentUser").mockReturnValue({
      id: "user-1",
      email: "test@example.com",
      emailVerified: true,
    });
    expect(() =>
      submitMessage({
        // @ts-expect-error testing missing category
        issueCategory: "",
        body: "Test message",
        consentAccepted: true,
      })
    ).toThrow("Issue category required");
  });

  it("calls rate limit before accepting submission", () => {
    const mockRateLimit = vi
      .spyOn(rateLimit, "checkRateLimit")
      .mockReturnValue(true);
    vi.spyOn(authConfig, "getCurrentUser").mockReturnValue({
      id: "user-42",
      email: "rate@example.com",
      emailVerified: true,
    });
    submitMessage({
      issueCategory: "healthcare",
      body: "Test message",
      consentAccepted: true,
    });
    expect(mockRateLimit).toHaveBeenCalledWith("user-42");
  });

  it("throws when rate limit is exceeded", () => {
    vi.spyOn(rateLimit, "checkRateLimit").mockReturnValue(false);
    vi.spyOn(authConfig, "getCurrentUser").mockReturnValue({
      id: "user-1",
      email: "test@example.com",
      emailVerified: true,
    });
    expect(() =>
      submitMessage({
        issueCategory: "housing",
        body: "Test message",
        consentAccepted: true,
      })
    ).toThrow("Rate limit");
  });

  it("returns message with status 'new' on success", () => {
    vi.spyOn(authConfig, "getCurrentUser").mockReturnValue({
      id: "user-1",
      email: "test@example.com",
      emailVerified: true,
    });
    vi.spyOn(rateLimit, "checkRateLimit").mockReturnValue(true);
    const message = submitMessage({
      issueCategory: "education",
      body: "Test message",
      consentAccepted: true,
    });
    expect(message.status).toBe("new");
  });

  it("records current consent version and timestamp", () => {
    vi.spyOn(authConfig, "getCurrentUser").mockReturnValue({
      id: "user-1",
      email: "test@example.com",
      emailVerified: true,
    });
    vi.spyOn(rateLimit, "checkRateLimit").mockReturnValue(true);
    const before = new Date();
    const message = submitMessage({
      issueCategory: "environment",
      body: "Test message",
      consentAccepted: true,
    });
    const after = new Date();
    expect(message.consent.version).toBe("constiuint-mvp-2026-06-06");
    expect(message.consent.consentedAt.getTime()).toBeGreaterThanOrEqual(
      before.getTime()
    );
    expect(message.consent.consentedAt.getTime()).toBeLessThanOrEqual(
      after.getTime()
    );
  });

  it("includes issue category and tags in returned message", () => {
    vi.spyOn(authConfig, "getCurrentUser").mockReturnValue({
      id: "user-1",
      email: "test@example.com",
      emailVerified: true,
    });
    vi.spyOn(rateLimit, "checkRateLimit").mockReturnValue(true);
    const message = submitMessage({
      issueCategory: "transportation",
      issueTags: ["roads", "transit"],
      body: "Fix the roads",
      consentAccepted: true,
    });
    expect(message.issueCategory).toBe("transportation");
    expect(message.issueTags).toEqual(["roads", "transit"]);
  });
});
