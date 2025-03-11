import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

function Pagination({ totalPages }: { totalPages: number; }) {
  const { page } = useParams();
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(Number(page) || 1);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setCurrentPage(Number(page) || 1);
  }, [page]);

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      navigate(`/${newPage}`);
    }
  };

  const handleInputSubmit = () => {
    const pageNumber = parseInt(inputValue, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      goToPage(pageNumber);
    }
    setInputValue('');
  };

  return (
    <div className="flex items-center space-x-2 p-4" data-testid="pagination">
      <Button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)} data-testid="previous-button">
        Previous
      </Button>
      <span key={currentPage}>Page {currentPage} of {totalPages}</span>
      <Button disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)} data-testid="next-button">  
        Next
      </Button>
      <div className="flex items-center space-x-1">
        <Label htmlFor="page-input">Go to:</Label>
        <Input
          id="page-input"
          data-testid="page-input"
          type="number"
          min="1"
          max={totalPages}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-16 text-center"
        />
        <Button onClick={handleInputSubmit} data-testid="go-button">Go</Button>
      </div>
    </div>
  );
};

export default Pagination;
