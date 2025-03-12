import '@vitest/browser/matchers';
import { render } from 'vitest-browser-react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { page, userEvent } from '@vitest/browser/context';
import Pagination from './Pagination';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  return {
    ...await importOriginal<typeof import('react-router-dom')>(),
    useNavigate: () => mockNavigate,
  };
});

describe('Pagination Component', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const totalPages = 5;
  
  it('renders with correct current page and total pages', async () => {   
    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path='/:page' element={<Pagination totalPages={totalPages} />} />
        </Routes>
      </MemoryRouter>
    );

    await expect.element(page.getByText('Page 1 of 5')).toBeInTheDocument();
  });

  it('navigates to the previous page when "Previous" button is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/2']}>
        <Routes>
          <Route path='/:page' element={<Pagination totalPages={totalPages} />} />
        </Routes>
      </MemoryRouter>
    );

    const previousButton = page.getByTestId('previous-button');
    await userEvent.click(previousButton);

    expect(mockNavigate).toHaveBeenCalledWith('/1');
  });

  it('navigates to the next page when "Next" button is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path='/:page' element={<Pagination totalPages={totalPages} />} />
        </Routes>
      </MemoryRouter>
    );

    const previousButton = page.getByTestId('next-button');
    await userEvent.click(previousButton);

    expect(mockNavigate).toHaveBeenCalledWith('/2');
  });

  it('disables "Previous" button on the first page', async () => {
    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path='/:page' element={<Pagination totalPages={totalPages} />} />
        </Routes>
      </MemoryRouter>
    );

    await expect.element(page.getByTestId('previous-button')).toBeDisabled();
  });

  it('disables "Next" button on the last page', async () => {
    render(
      <MemoryRouter initialEntries={['/5']}>
        <Routes>
          <Route path='/:page' element={<Pagination totalPages={totalPages} />} />
        </Routes>
      </MemoryRouter>
    );

    await expect.element(page.getByTestId('next-button')).toBeDisabled();
  });

  it('navigates to the correct page when a valid number is entered in the input field', async () => {
    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path='/:page' element={<Pagination totalPages={totalPages} />} />
        </Routes>
      </MemoryRouter>
    );

    const pageInput = page.getByTestId('page-input');
    await userEvent.fill(pageInput, '');
    await userEvent.fill(pageInput, '3');
    await userEvent.click(page.getByTestId('go-button'));

    expect(mockNavigate).toHaveBeenCalledWith('/3');
  });

  it('does not navigate for invalid page numbers', async () => {
    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path='/:page' element={<Pagination totalPages={totalPages} />} />
        </Routes>
      </MemoryRouter>
    );

    const pageInput = page.getByTestId('page-input');
    await userEvent.fill(pageInput, '');
    await userEvent.fill(pageInput, '6');
    await userEvent.click(page.getByTestId('go-button'));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('resets input value after submitting', async () => {
    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path='/:page' element={<Pagination totalPages={totalPages} />} />
        </Routes>
      </MemoryRouter>
    );

    const pageInput = page.getByTestId('page-input');
    await userEvent.fill(pageInput, '');
    await userEvent.fill(pageInput, '3');
    await userEvent.click(page.getByTestId('go-button'));

    await expect.element(pageInput).toHaveValue(null);
  });
});
