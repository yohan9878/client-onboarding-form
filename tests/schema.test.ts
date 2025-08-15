import { describe, it, expect } from "vitest";
import { OnboardSchema } from "../lib/schema";

describe("OnboardSchema", () => {
  const validData = {
    fullName:"Ada Lovelace",
    email: "ada@example.com",
    companyName:"Analytical Engines Ltd",
    services: ["UI/UX", "Web Dev"],
    budgetUsd: 50000,
    projectStartDate: new Date().toISOString().split("T")[0],
    acceptTerms: true,
  };

  it("should pass with valid data", () => {
    expect(() => OnboardSchema.parse(validData)).not.toThrow();
  });

  it("should fail if fullName is too short", () => {
    const data = { ...validData, fullName: "J" };
    expect(() => OnboardSchema.parse(data)).toThrow(
      /Full name must be at least 2 characters/
    );
  });

  it("should fail if fullName has invalid characters", () => {
    const data = { ...validData, fullName: "John123" };
    expect(() => OnboardSchema.parse(data)).toThrow(
      /Only letters, spaces, ' and - are allowed/
    );
  });

  it("should fail if email is invalid", () => {
    const data = { ...validData, email: "not-an-email" };
    expect(() => OnboardSchema.parse(data)).toThrow(/Invalid email address/);
  });

  it("should fail if companyName is too short", () => {
    const data = { ...validData, companyName: "A" };
    expect(() => OnboardSchema.parse(data)).toThrow(
      /Company name must be at least 2 characters/
    );
  });

  it("should fail if no services are selected", () => {
    const data = { ...validData, services: [] };
    expect(() => OnboardSchema.parse(data)).toThrow(
      /Select at least one service/
    );
  });

  it("should fail if budgetUsd is below minimum", () => {
    const data = { ...validData, budgetUsd: 50 };
    expect(() => OnboardSchema.parse(data)).toThrow(/Minimum budget is 100/);
  });

  it("should fail if budgetUsd is above maximum", () => {
    const data = { ...validData, budgetUsd: 2_000_000 };
    expect(() => OnboardSchema.parse(data)).toThrow(
      /Maximum budget is 1,000,000/
    );
  });

  it("should fail if projectStartDate is in the past", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const data = {
      ...validData,
      projectStartDate: yesterday.toISOString().split("T")[0],
    };
    expect(() => OnboardSchema.parse(data)).toThrow(
      /Date must be today or later/
    );
  });

  it("should fail if acceptTerms is false", () => {
    const data = { ...validData, acceptTerms: false };
    expect(() => OnboardSchema.parse(data)).toThrow(
      /You must accept the terms/
    );
  });

  it("should pass if budgetUsd is omitted", () => {
    const { budgetUsd, ...dataWithoutBudget } = validData;
    expect(() => OnboardSchema.parse(dataWithoutBudget)).not.toThrow();
  });
});
