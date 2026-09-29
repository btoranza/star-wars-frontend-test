import React, { useEffect, useState } from 'react';
import { Button, ButtonEmphasis, Theme } from '@lumx/react';
import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';
import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const DOTS = '...';

const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | typeof DOTS)[] => {
  const totalSlots = siblingCount * 2 + 5;

  if (totalSlots >= totalPages) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftRange = range(1, 3 + siblingCount * 2);
    return [...leftRange, DOTS, totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightRange = range(totalPages - (2 + siblingCount * 2), totalPages);
    return [1, DOTS, ...rightRange];
  }

  return [1, DOTS, ...range(leftSiblingIndex, rightSiblingIndex), DOTS, totalPages];
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 600px)');
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return isMobile;
};

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const isMobile = useIsMobile();

  if (totalPages <= 1) return null;

  const pages = isMobile ? getPaginationRange(currentPage, totalPages, 0) : range(1, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <Button
        theme={Theme.dark}
        emphasis={ButtonEmphasis.low}
        leftIcon={mdiChevronLeft}
        isDisabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      />

      {pages.map((page, index) =>
        page === DOTS ? (
          <span key={`dots-${index}`} className={styles.dots} aria-hidden="true">
            {DOTS}
          </span>
        ) : (
          <Button
            key={page}
            className={styles.pageButton}
            theme={Theme.dark}
            emphasis={page === currentPage ? ButtonEmphasis.high : ButtonEmphasis.low}
            onClick={() => onPageChange(page as number)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Button>
        )
      )}

      <Button
        theme={Theme.dark}
        emphasis={ButtonEmphasis.low}
        rightIcon={mdiChevronRight}
        isDisabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      />
    </nav>
  );
};
