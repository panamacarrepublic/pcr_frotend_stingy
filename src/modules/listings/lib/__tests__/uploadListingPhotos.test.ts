import { supabase } from "@/lib/supabase-client";

import { PhotoUploadError, uploadListingPhotos } from "../uploadListingPhotos";

jest.mock("@/lib/supabase-client", () => ({
  supabase: {
    auth: { getSession: jest.fn() },
    storage: { from: jest.fn() },
  },
}));

const mockGetSession = supabase.auth.getSession as jest.Mock;
const mockFrom = supabase.storage.from as jest.Mock;

const mockUpload = jest.fn();
const mockGetPublicUrl = jest.fn();

beforeEach(() => {
  mockGetSession.mockReset();
  mockFrom.mockReset();
  mockUpload.mockReset();
  mockGetPublicUrl.mockReset();

  mockGetSession.mockResolvedValue({ data: { session: { user: { id: "user-1" } } } });
  mockFrom.mockReturnValue({ upload: mockUpload, getPublicUrl: mockGetPublicUrl });
  mockUpload.mockResolvedValue({ error: null });
  mockGetPublicUrl.mockImplementation((path: string) => ({
    data: { publicUrl: `https://cdn.test/${path}` },
  }));

  global.fetch = jest.fn().mockResolvedValue({
    blob: async () => new Blob(["binary"], { type: "image/png" }),
  }) as unknown as typeof fetch;

  Object.defineProperty(global, "crypto", {
    value: { randomUUID: () => "fixed-uuid" },
    configurable: true,
  });
});

test("blob: URLs are uploaded and replaced with durable public URLs", async () => {
  const result = await uploadListingPhotos([{ url: "blob:http://localhost/abc", sort_order: 1 }]);

  expect(result).toEqual([{ url: "https://cdn.test/user-1/fixed-uuid.png", sort_order: 1 }]);
  expect(mockFrom).toHaveBeenCalledWith("listing-images");
});

test("the upload path is namespaced by user id so storage RLS can scope writes", async () => {
  await uploadListingPhotos([{ url: "blob:http://localhost/abc", sort_order: 1 }]);

  const [path] = mockUpload.mock.calls[0];
  expect(path).toBe("user-1/fixed-uuid.png");
});

test("already-hosted URLs pass through untouched and are not re-uploaded", async () => {
  const photos = [{ url: "https://cdn.example.com/existing.jpg", sort_order: 2 }];

  await expect(uploadListingPhotos(photos)).resolves.toEqual(photos);
  expect(mockUpload).not.toHaveBeenCalled();
});

test("sort_order survives the upload", async () => {
  const result = await uploadListingPhotos([
    { url: "blob:http://localhost/a", sort_order: 3 },
    { url: "blob:http://localhost/b", sort_order: 1 },
  ]);

  expect(result.map((p) => p.sort_order)).toEqual([3, 1]);
});

test("a storage failure rejects rather than posting a half-uploaded gallery", async () => {
  mockUpload.mockResolvedValueOnce({ error: { message: "new row violates row-level security policy" } });

  await expect(
    uploadListingPhotos([{ url: "blob:http://localhost/abc", sort_order: 1 }]),
  ).rejects.toThrow(PhotoUploadError);
});

test("a missing session fails before the POST would 401", async () => {
  mockGetSession.mockResolvedValueOnce({ data: { session: null } });

  await expect(
    uploadListingPhotos([{ url: "blob:http://localhost/abc", sort_order: 1 }]),
  ).rejects.toThrow(/sesión/i);
  expect(mockUpload).not.toHaveBeenCalled();
});

test("a revoked object URL surfaces as a photo error, not a raw fetch failure", async () => {
  global.fetch = jest.fn().mockRejectedValue(new TypeError("Failed to fetch")) as unknown as typeof fetch;

  await expect(
    uploadListingPhotos([{ url: "blob:http://localhost/gone", sort_order: 1 }]),
  ).rejects.toThrow(PhotoUploadError);
});
