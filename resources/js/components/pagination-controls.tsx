/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 05/09/2025 - 00:29:42
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 05/09/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationControlsProps {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, lastPage, onPageChange }) => {
    return (
        <div className="flex items-center gap-4">
            <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
                Halaman {currentPage} dari {lastPage}
            </span>
            <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === lastPage} variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};
