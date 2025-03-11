import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Utils } from './Utils';

function ImageEditor() {
  const { id, page } = useParams();
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [greyscale, setGreyscale] = useState(false);
  const [blur, setBlur] = useState(0);
  const [status, setStatus] = useState(false);

  const imageUrl = `https://picsum.photos/id/${id}/${width}/${height}${greyscale ? '?grayscale' : ''}${blur > 0 ? `${greyscale ? '&' : '?'}blur=${blur}` : ''}`;

  const handleDownload = async () => {
    const result = await Utils.downloadImage(imageUrl, Number(id));
    if (result?.status === 'error') {
      setStatus(true);
      setTimeout(() => setStatus(false), 5000);
    }
  };

  return (
    <div className="container p-4 flex flex-col gap-4">
      {status && (
        <Alert>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            There was a problem with your download. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <Button className="mt-4" data-testid="back-to-gallery-button" asChild>
        <Link to={`/${page}`}>&larr; Back to Gallery</Link>
      </Button>

      <h2 className="text-xl font-bold">Edit Image</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Width</Label>
          <Input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} data-testid="image-width" />
        </div>
        <div>
          <Label>Height</Label>
          <Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} data-testid="image-height" />
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={greyscale} onCheckedChange={setGreyscale} data-testid="greyscale-switch" />
          <Label>Greyscale</Label>
        </div>
        <div>
          <Label>Blur (1-10)</Label>
          <Input type="range" min="0" max="10" value={blur} onChange={(e) => setBlur(Number(e.target.value))} data-testid="image-blur" />
        </div>
      </div>
      <img src={imageUrl} alt="Edited preview" className="mt-4 rounded-lg shadow-md" data-testid="preview-image" />
      <Button onClick={handleDownload} className="mt-4" data-testid="download-image-button">Download Image</Button>
    </div>
  );
}

export default ImageEditor;
