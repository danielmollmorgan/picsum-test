import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

function NotFound() {
  return (
    <div className="container p-4 flex flex-col gap-4">
      <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="text-lg mt-4">Sorry, the page you're looking for does not exist.</p>
      <Button className="mt-4" data-testid="back-to-home-button" asChild>
        <Link to="/">&larr; Go to Homepage</Link>
      </Button>
    </div>
  );
}

export default NotFound;