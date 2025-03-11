import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Utils } from './Utils';
import Pagination from './Pagination';
import GalleryImage from './GalleryImage';

function ImageGallery() {
  const { page } = useParams();
  const currentPage = Number(page) || 1;

  const [images, setImages] = useState([])
  const totalPages = 10;

  useEffect(() => {
    Utils.fetchPicsumImages(currentPage).then(setImages);
  }, [currentPage]);

  return (
    <>
      {images.length === 0 && <div className="container text-xl p-4">Loading...</div>}
      {images.length > 0 && (
        <>
          <div className="container mx-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.length && images.map((image: GalleryImage) => <GalleryImage key={image.id} image={image} />)}
            </div>
          </div>
          <Pagination totalPages={totalPages} />
        </>
      )}
    </>
  )
}

export default ImageGallery;

