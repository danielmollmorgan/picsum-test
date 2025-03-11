import { vi, describe, it, expect, afterEach } from 'vitest';
import fetchPicsumImages from './fetchPicsumImages';

describe('fetchPicsumImages', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch and return images successfully', async () => {
    const mockData = [
      { id: '1', author: 'John Doe', url: 'https://picsum.photos/id/1/200/300' },
      { id: '2', author: 'Jane Doe', url: 'https://picsum.photos/id/2/200/300' },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    );

    const result = await fetchPicsumImages(1, 2);
    expect(fetch).toHaveBeenCalledWith('https://picsum.photos/v2/list?page=1&limit=2');
    expect(result).toEqual(mockData);
  });

  it('should return an empty array when fetch fails', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    const result = await fetchPicsumImages();
    await expect(fetch).rejects.toThrow('Network error');
    expect(fetch).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should return an empty array when response is not OK', async () => {
    global.fetch = vi.fn(() =>
      // ok: false property simulates a failed response - a non-200 HTTP status code (e.g., 404 Not Found, 500 Internal Server Error).
      Promise.resolve({
        ok: false,
      } as Response)
    );

    const result = await fetchPicsumImages();
    expect(fetch).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
