import '@vitest/browser/matchers';
import { render } from 'vitest-browser-react'
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, it, expect, afterEach, beforeEach, Mock } from 'vitest';
import { page, userEvent } from '@vitest/browser/context';
import { Utils } from './Utils';
import ImageEditor from './ImageEditor';

describe('ImageEditor Component', () => {
  const IMAGE_ID = 10;
  const PAGE = 1;

  const setup = (id = IMAGE_ID, page = PAGE) => {
    return render(
      <MemoryRouter initialEntries={[`/edit/${id}/${page}`]}>
        <Routes>
          <Route path='/edit/:id/:page' element={<ImageEditor />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.spyOn(Utils, 'downloadImage');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the ImageEditor component correctly', async () => {
    const { getByText, getByTestId, getByRole } = setup();

    await expect.element(getByText('Edit Image')).toBeInTheDocument();
    await expect.element(getByText('Width')).toBeInTheDocument();
    await expect.element(getByTestId('image-width')).toBeInTheDocument();

    await expect.element(getByText('Height')).toBeInTheDocument();
    await expect.element(getByTestId('image-height')).toBeInTheDocument();
    
    await expect.element(getByText('Greyscale')).toBeInTheDocument();
    await expect.element(getByTestId('greyscale-switch')).toBeInTheDocument();
    
    await expect.element(getByText('Blur (1-10)')).toBeInTheDocument();
    await expect.element(getByTestId('image-blur')).toBeInTheDocument();
    
    await expect.element(getByRole('button', { name: /Download Image/i })).toBeInTheDocument();
  });

  it('updates the image URL when width and height inputs change', async () => {
    setup();

    const widthInput = page.getByTestId('image-width');
    const heightInput = page.getByTestId('image-height');

    await userEvent.fill(widthInput, '');
    await userEvent.fill(widthInput, '500');
    await userEvent.fill(heightInput, '');
    await userEvent.fill(heightInput, '350');

    const image = page.getByTestId('preview-image');
    await expect.element(image).toHaveAttribute('src', expect.stringContaining('/id/10/500/350'));
  });

  it('toggles greyscale correctly', async () => {
    setup();

    const greyscaleSwitch = page.getByTestId('greyscale-switch');
    const image = page.getByTestId('preview-image');

    await expect.element(image).toHaveAttribute('src', expect.not.stringContaining('grayscale'));

    await userEvent.click(greyscaleSwitch);
    await expect.element(image).toHaveAttribute('src', expect.stringContaining('grayscale'));
  });

  it('updates blur value and reflects it in the image URL', async () => {
    setup();

    const blurInput = page.getByTestId('image-blur');
    const image = page.getByTestId('preview-image');

    // TODO: there has to be a better way to test this
    // setting the value of a range seems to be a bit tricky
    await userEvent.click(blurInput);
    await userEvent.keyboard('{ArrowRight}');
    await expect.element(image).toHaveAttribute('src', expect.stringContaining('blur=6'));

    await userEvent.keyboard('{ArrowLeft}>5/');
    await expect.element(image).toHaveAttribute('src', expect.stringContaining('blur='));
  });

  it('navigates back to the gallery when clicking the back button', async () => {
    setup();

    const backButton = page.getByTestId('back-to-gallery-button');
    await expect.element(backButton).toHaveAttribute('href', '/1');
  });

  it('calls the download function when clicking the Download button', async () => {
    setup();

    const downloadButton = page.getByTestId('download-image-button');
    await userEvent.click(downloadButton);

    await expect(Utils.downloadImage).toHaveBeenCalledWith(`https://picsum.photos/id/${IMAGE_ID}/400/300`, IMAGE_ID);
  });

  it('displays a dialog box if the download fails', async () => {
    setup();

    (Utils.downloadImage as Mock).mockImplementation(() => Promise.resolve({ status: 'error' }));

    const downloadButton = page.getByTestId('download-image-button');
    await userEvent.click(downloadButton);

    await expect(Utils.downloadImage).toHaveBeenCalledWith(`https://picsum.photos/id/${IMAGE_ID}/400/300`, IMAGE_ID);
    
    await expect.element(page.getByText('There was a problem with your download. Please try again.')).toBeInTheDocument();
  });
});
