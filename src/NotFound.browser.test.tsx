import '@vitest/browser/matchers';
import { render } from 'vitest-browser-react'
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { page } from '@vitest/browser/context';
import NotFound from './NotFound';

describe('ImageEditor Component', () => {
  it('renders the correct 404 message', async () => {
    render(
      <MemoryRouter initialEntries={[`/bad-route`]}>
        <Routes>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    );

    await expect.element(page.getByText('404 - Page Not Found')).toBeInTheDocument();

    await expect.element(
      page.getByText("Sorry, the page you're looking for does not exist.")
    ).toBeInTheDocument();
  });

  it('renders a "Go to Homepage" button', async () => {
    render(
      <MemoryRouter initialEntries={[`/bad-route`]}>
        <Routes>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    );

    const button = page.getByTestId('back-to-home-button');

    await expect.element(button).toBeInTheDocument();
    await expect.element(button).toHaveTextContent('Go to Homepage');
  });

  it('contains a link that navigates to "/"', async () => {
    render(
      <MemoryRouter initialEntries={[`/bad-route`]}>
        <Routes>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    );

    const link = page.getByRole('link', { name: /go to homepage/i });

    await expect.element(link).toHaveAttribute('href', '/');
  });
});
