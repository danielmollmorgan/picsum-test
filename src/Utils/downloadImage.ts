async function downloadImage(imageUrl: string, id: number) {
  return fetch(imageUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `edited_image_${id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return { status: 'success' };
    })
    .catch((error) => ({ status: 'error', message: error.message }));
};

export default downloadImage;