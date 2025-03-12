import '@vitest/browser/matchers';
import { render } from 'vitest-browser-react'
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { page, userEvent } from '@vitest/browser/context';
import GalleryImage from './GalleryImage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  return {
    ...await importOriginal<typeof import('react-router-dom')>(),
    useNavigate: () => mockNavigate,
  };
});

describe('GalleryImage', () => {
  const mockImages = [
    { id: '1', author: 'Author 1', url: 'https://picsum.photos/id/1/400/300', download_url: 'https://picsum.photos/id/1/400/300', width: 400, height: 300 },
    { id: '2', author: 'Author 2', url: 'https://picsum.photos/id/2/400/300', download_url: 'https://picsum.photos/id/2/400/300', width: 400, height: 300 }
  ];

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the image with correct attributes', async () => {   
    render(<GalleryImage image={mockImages[0]} />);

    const imageElement = page.getByRole('img');
    await expect.element(imageElement).toHaveAttribute('src', 'https://picsum.photos/id/1/400/300');
    await expect.element(imageElement).toHaveAttribute('alt', 'Author 1');
    await expect.element(imageElement).toHaveAttribute('loading', 'lazy');

    await expect.element(page.getByRole('figure')).toBeInTheDocument();
    await expect.element(page.getByText('Author 1')).toBeInTheDocument();
  });

  it('navigates to the edit page on image click', async () => {
    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path='/:page' element={<GalleryImage image={mockImages[1]} />} />
        </Routes>
      </MemoryRouter>
    )

    const imageLink = page.getByTestId('gallery-image-link');
    await userEvent.click(imageLink);

    expect(mockNavigate).toHaveBeenCalledWith('/edit/2/1');
  });
});
