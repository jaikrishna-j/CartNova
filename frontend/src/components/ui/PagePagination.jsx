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
        <div className="w-full flex justify-center items-center py-4 sm:py-6 overflow-x-auto">
            <Pagination className="w-full max-w-full">
                <PaginationContent className="list-none flex flex-nowrap justify-center items-center gap-1 sm:gap-1.5 sm:gap-2 md:gap-2.5">
                    
                    {/* Previous Button */}
                    <PaginationItem
                        onClick={() => handleSetPage(currentPage - 1)}
                        className="p-0 flex-shrink-0"
                    >
                        <PaginationPrevious
                            disabled={currentPage === 1}
                            href="#"
                            className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 md:px-4 text-[10px] sm:text-xs md:text-sm lg:text-base bg-white border border-gray-300 text-gray-700 rounded-full sm:rounded-xl shadow-sm hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-300 font-medium whitespace-nowrap [&>span]:hidden sm:[&>span]:inline [&>svg]:h-3.5 [&>svg]:w-3.5 sm:[&>svg]:h-4 sm:[&>svg]:w-4"
                        />
                    </PaginationItem>

                    {/* Map over page numbers/ellipses */}
                    {pagesToShow.map((item, index) => (
                        <PaginationItem
                            key={index}
                            onClick={typeof item === 'number' ? () => handleSetPage(item) : undefined}
                            className="p-0 flex-shrink-0"
                        >
                            {item === 'ellipsis-start' || item === 'ellipsis-end' ? (
                                <PaginationEllipsis className="text-gray-400 hidden sm:flex h-8 w-8 sm:h-9 sm:w-9 md:h-11 md:w-11 items-center justify-center" />
                            ) : (
                                <PaginationLink
                                    href="#"
                                    isActive={item === currentPage}
                                    className={`h-8 w-8 sm:h-9 sm:w-9 md:h-11 md:w-11 text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold flex items-center justify-center
                                              rounded-full sm:rounded-xl transition-all duration-200 border
                                              ${item === currentPage
                                                ? "bg-indigo-600 text-white shadow-md border-indigo-600 hover:bg-indigo-700 hover:shadow-lg scale-105" // Active style
                                                : "bg-white border-gray-300 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-sm" // Default style
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
                        className="p-0 flex-shrink-0"
                    >
                        <PaginationNext
                            disabled={currentPage === totalPages}
                            href="#"
                            className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 md:px-4 text-[10px] sm:text-xs md:text-sm lg:text-base bg-white border border-gray-300 text-gray-700 rounded-full sm:rounded-xl shadow-sm hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-300 font-medium whitespace-nowrap [&>span]:hidden sm:[&>span]:inline [&>svg]:h-3.5 [&>svg]:w-3.5 sm:[&>svg]:h-4 sm:[&>svg]:w-4"
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default PagePagination;