import { useMemo, useState, useEffect } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const PagePagination = ({ numOfPages, handleSetPage, page }) => {

    const totalPages = numOfPages;
    const currentPage = page;

    // Logic for responsiveness (untouched)
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);
    const siblingCount = isMobile ? 0 : 1;

    // Logic to determine which page numbers to show (untouched)
    const pagesToShow = useMemo(() => {
        const pages = [];
        const pushPage = (num) => {
            if (pages.length === 0 || pages[pages.length - 1] !== num) {
                pages.push(num);
            }
        };
        if (totalPages === 0) return [];
        pushPage(1);
        const startPage = Math.max(2, currentPage - siblingCount);
        const endPage = Math.min(totalPages - 1, currentPage + siblingCount);
        if (startPage > 2) {
            pages.push('ellipsis-start');
        }
        for (let i = startPage; i <= endPage; i++) {
            pushPage(i);
        }
        if (endPage < totalPages - 1) {
            pages.push('ellipsis-end');
        }
        if (totalPages > 1) {
            pushPage(totalPages);
        }
        return pages;
    }, [currentPage, totalPages, siblingCount]);

    if (totalPages <= 1) return null;


    return (
        <Pagination>
            <PaginationContent className="list-none w-full flex justify-center space-x-1 sm:space-x-2">
                
                {/* Previous Button */}
                <PaginationItem
                    onClick={() => handleSetPage(currentPage - 1)}
                    className="p-0"
                >
                    <PaginationPrevious
                        disabled={currentPage === 1}
                        href="#"
                        // THEME: Switched to a light, bordered style to match the theme
                        className="h-9 px-3 text-sm sm:h-11 sm:px-5 sm:text-base bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800"
                    />
                </PaginationItem>

                {/* Map over page numbers/ellipses */}
                {pagesToShow.map((item, index) => (
                    <PaginationItem
                        key={index}
                        onClick={typeof item === 'number' ? () => handleSetPage(item) : undefined}
                    >
                        {item === 'ellipsis-start' || item === 'ellipsis-end' ? (
                            <PaginationEllipsis className="text-gray-500 hidden sm:block" />
                        ) : (
                            <PaginationLink
                                href="#"
                                isActive={item === currentPage}
                                // THEME: Updated active and default styles to match your app's theme
                                className={`h-9 w-9 text-sm sm:h-11 sm:w-11 sm:text-base font-semibold flex items-center justify-center
                                          rounded-xl transition duration-300 border
                                          ${item === currentPage
                                            ? "bg-indigo-600 text-white shadow-lg border-transparent" // Active style
                                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400" // Default style
                                          }`}
                            >
                                {item}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {/* Next Button */}
                <PaginationItem
                    onClick={() => handleSetPage(currentPage + 1)}
                    className="p-0"
                >
                    <PaginationNext
                        disabled={currentPage === totalPages}
                        href="#"
                        // THEME: Switched to a light, bordered style to match the theme
                        className="h-9 px-3 text-sm sm:h-11 sm:px-5 sm:text-base bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800"
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default PagePagination;