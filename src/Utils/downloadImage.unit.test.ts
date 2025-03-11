import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';
import downloadImage from './downloadImage';

/**
 * @jest-environment jsdom
 */

describe('downloadImage', () => {
  const mockBlob = new Blob(['test'], { type: 'image/jpeg' });

  beforeEach(() => {
    global.fetch = vi.fn();

    global.URL.createObjectURL = vi.fn(() => 'http://www.mocked-url.com');
    global.document.body.appendChild = vi.fn();
    global.document.body.removeChild = vi.fn();
    global.document.createElement = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch the image and trigger a download', async () => {
    const mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
      remove: vi.fn(),
    } as unknown as HTMLAnchorElement;
    
    (document.createElement as Mock).mockReturnValue(mockLink);
    (global.fetch as Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      } as Response));

    const imageUrl = 'https://example.com/image.jpg';
    const imageId = 123;

    const result = await downloadImage(imageUrl, imageId);

    expect(fetch).toHaveBeenCalledWith(imageUrl);
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(mockLink.href).toContain('http://www.mocked-url.com');
    expect(mockLink.download).toBe(`edited_image_${imageId}.jpg`);
    expect(mockLink.click).toHaveBeenCalled();

    const expectedLink = {
       click: expect.any(Function),
       download: 'edited_image_123.jpg',
       href: 'http://www.mocked-url.com',
       remove: expect.any(Function),
     };

    expect(document.body.appendChild).toHaveBeenCalledWith(expectedLink);
    expect(document.body.removeChild).toHaveBeenCalledWith(expectedLink);
    expect(result).toEqual({ status: 'success' });
  });

  it('should handle fetch errors gracefully', async () => {
    (global.fetch as Mock).mockImplementation(() => Promise.reject(new Error('Network Error')));

    const imageUrl = 'https://example.com/image.jpg';
    const imageId = 123;

    const result = await downloadImage(imageUrl, imageId);

    expect(fetch).toHaveBeenCalledWith(imageUrl);
    await expect(fetch).rejects.toThrow('Network Error');
    expect(result).toEqual({ status: 'error', message: 'Network Error' });
  });
});
