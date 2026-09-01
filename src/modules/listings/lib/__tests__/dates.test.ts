import { formatRelativeDate } from "../dates";

const NOW = new Date("2026-05-20T12:00:00Z");

test("today reads as a word, not 'hace 0 días'", () => {
  expect(formatRelativeDate("2026-05-20T09:00:00Z", NOW)).toBe("hoy");
});

test("a few days back reads in days", () => {
  expect(formatRelativeDate("2026-05-17T12:00:00Z", NOW)).toBe("hace 3 días");
});

test("a couple of months back reads in months", () => {
  expect(formatRelativeDate("2026-03-18T12:00:00Z", NOW)).toBe("hace 2 meses");
});

test("a malformed date does not render 'Invalid Date'", () => {
  expect(formatRelativeDate("not-a-date", NOW)).toBe("—");
});
