import { useNavigate, useParams } from 'react-router-dom';

function GalleryImage({ image }: { image: GalleryImage }) {
  const { page } = useParams();
  const heightRatio = Math.round((image.height / image.width) * 400); // Maintain aspect ratio
  const currentPage = Number(page) || 1;

  const navigate = useNavigate();
  const handleImageClick = (e: React.MouseEvent<HTMLAnchorElement>, id: number) => {
    e.preventDefault();
    navigate(`/edit/${id}/${currentPage}`);
  };

  return (
    <figure key={image.id} data-testid="gallery-image">
      <a href='#' onClick={(e) => handleImageClick(e, Number(image.id))} data-testid="gallery-image-link">
        <img
          src={`https://picsum.photos/id/${image.id}/400/${heightRatio}`}
          alt={image.author}
          loading="lazy"
          className="rounded shadow-md w-full"
        />
        <figcaption className="text-center text-sm mt-2">{image.author}</figcaption>
      </a>
    </figure>
  );
}

export default GalleryImage;