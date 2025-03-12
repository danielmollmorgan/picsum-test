import '@vitest/browser/matchers';
import { render } from 'vitest-browser-react'
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { page } from '@vitest/browser/context';
import App from './App';
import { isTypedArray } from 'node:util/types';

vi.mock('./ImageGallery', async (importOriginal) => {
  return {
    ...await importOriginal<typeof import('./ImageGallery')>(),
    default: () => <div data-testid="image-gallery">ImageGallery Component</div>,
  };
});

vi.mock('./ImageEditor', async (importOriginal) => {
  return {
    ...await importOriginal<typeof import('./ImageEditor')>(),
    default: () => <div data-testid="image-editor">ImageEditor Component</div>,
  };
});

vi.mock('./NotFound', async (importOriginal) => {
  return {
    ...await importOriginal<typeof import('./NotFound')>(),
    default: () => <div data-testid="not-found">NotFound Component</div>,
  };
});

describe('App Component Routing', () => {
  const renderWithRouter = (initialRoute: string) => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>
    );
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders ImageGallery when visiting /', async () => {
    renderWithRouter('/');

    await expect.element(page.getByTestId('image-gallery')).toBeInTheDocument();
  });

  it('renders ImageGallery when visiting a paginated route (e.g., /1)', async () => {
    renderWithRouter('/1');

    await expect.element(page.getByTestId('image-gallery')).toBeInTheDocument();
  });

  it('renders ImageEditor when visiting /edit/:id/:page', async () => {
    renderWithRouter('/edit/123/1');

    await expect.element(page.getByTestId('image-editor')).toBeInTheDocument();
  });

  it('renders NotFound when visiting an unknown route', async () => {
    renderWithRouter('/unknown/route');

    await expect.element(page.getByTestId('not-found')).toBeInTheDocument();
  });
});
