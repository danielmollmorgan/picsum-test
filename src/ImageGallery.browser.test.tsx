import { render } from 'vitest-browser-react'
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, it, expect, afterEach, beforeEach, Mock } from 'vitest';
import { page } from '@vitest/browser/context'
import ImageGallery from './ImageGallery';
import { Utils } from './Utils';

const mockImages = [
  { id: 1, author: 'John Doe', download_url: 'https://picsum.photos/id/1/400/300' },
  { id: 2, author: 'Jane Doe', download_url: 'https://picsum.photos/id/2/400/300' }
];

describe('ImageGallery', () => {
  beforeEach(() => {
    vi.spyOn(Utils, 'fetchPicsumImages');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state initially', async () => {
    (Utils.fetchPicsumImages as Mock).mockResolvedValueOnce([]);

    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path="/:page" element={<ImageGallery />} />
        </Routes>
      </MemoryRouter>
    );
    
    await expect.element(page.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders images after fetching', async () => {
    (Utils.fetchPicsumImages as Mock).mockResolvedValueOnce(mockImages);

    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path="/:page" element={<ImageGallery />} />
        </Routes>
      </MemoryRouter>
    );
    
    await expect.element(page.getByText('John Doe')).toBeInTheDocument();
    await expect.element(page.getByText('Jane Doe')).toBeInTheDocument();

    await expect.element(page.getByTestId('pagination')).toBeInTheDocument();
    await expect(page.getByTestId('gallery-image').elements()).toHaveLength(mockImages.length);
  });
});
