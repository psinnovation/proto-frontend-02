'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import type { PaginationProps } from '@mui/material/Pagination';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import TablePagination from '@mui/material/TablePagination';

import { Iconify } from 'src/components/iconify';

import { PaginationItems } from './pagination-items';
import { ComponentBox, ComponentLayout } from '../../layout';

// ----------------------------------------------------------------------

const SIZES = ['small', 'medium', 'large'] as const;
const COLORS = ['standard', 'primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

const componentBoxStyles: SxProps<Theme> = {
  flexDirection: 'column',
};

const paginationProps: PaginationProps = {
  count: 8,
  siblingCount: 0,
};

// ----------------------------------------------------------------------

export function PaginationView() {
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    []
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  const renderDivider = () => <Divider sx={{ width: 1 }} />;

  const DEMO_COMPONENTS = [
    {
      name: 'Shapes',
      component: (
        <Box
          sx={{
            rowGap: 5,
            columnGap: 3,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          }}
        >
          <ComponentBox title="Circular" sx={componentBoxStyles}>
            <Pagination {...paginationProps} shape="circular" variant="text" />
            <Pagination {...paginationProps} shape="circular" variant="text" disabled />
            {renderDivider()}
            <Pagination {...paginationProps} shape="circular" variant="outlined" />
            <Pagination {...paginationProps} shape="circular" variant="outlined" disabled />
            {renderDivider()}
            <Pagination {...paginationProps} shape="circular" variant="soft" />
            <Pagination {...paginationProps} shape="circular" variant="soft" disabled />
          </ComponentBox>

          <ComponentBox title="Rounded" sx={componentBoxStyles}>
            <Pagination {...paginationProps} shape="rounded" variant="text" />
            <Pagination {...paginationProps} shape="rounded" variant="text" disabled />
            {renderDivider()}
            <Pagination {...paginationProps} shape="rounded" variant="outlined" />
            <Pagination {...paginationProps} shape="rounded" variant="outlined" disabled />
            {renderDivider()}
            <Pagination {...paginationProps} shape="rounded" variant="soft" />
            <Pagination {...paginationProps} shape="rounded" variant="soft" disabled />
          </ComponentBox>
        </Box>
      ),
    },
    {
      name: 'Variants',
      component: (
        <Box>
          <ComponentBox title="Text" sx={componentBoxStyles}>
            {COLORS.map((color) => (
              <Pagination key={color} color={color} count={10} variant="text" />
            ))}
          </ComponentBox>

          <ComponentBox title="Outlined" sx={{ ...componentBoxStyles, my: 5 }}>
            {COLORS.map((color) => (
              <Pagination key={color} color={color} count={10} variant="outlined" />
            ))}
          </ComponentBox>

          <ComponentBox title="Soft" sx={componentBoxStyles}>
            {COLORS.map((color) => (
              <Pagination key={color} color={color} count={10} variant="soft" />
            ))}
          </ComponentBox>
        </Box>
      ),
    },
    {
      name: 'Sizes',
      component: (
        <ComponentBox sx={componentBoxStyles}>
          {SIZES.map((size) => (
            <Pagination count={10} key={size} size={size} />
          ))}
        </ComponentBox>
      ),
    },
    {
      name: 'Buttons',
      component: (
        <ComponentBox sx={componentBoxStyles}>
          <Pagination count={10} showFirstButton showLastButton />
          <Pagination count={10} hidePrevButton hideNextButton />
        </ComponentBox>
      ),
    },
    {
      name: 'Ranges',
      component: (
        <ComponentBox sx={componentBoxStyles}>
          <Pagination count={11} defaultPage={6} siblingCount={0} />
          <Pagination count={11} defaultPage={6} />
          <Pagination count={11} defaultPage={6} siblingCount={0} boundaryCount={2} />
          <Pagination count={11} defaultPage={6} boundaryCount={2} />
        </ComponentBox>
      ),
    },
    {
      name: 'Custom icons',
      component: (
        <ComponentBox>
          <Pagination
            count={10}
            renderItem={(item) => (
              <PaginationItem
                slots={{
                  previous: () => (
                    <Iconify icon="eva:arrow-forward-fill" sx={{ transform: 'scaleX(-1)' }} />
                  ),
                  next: () => <Iconify icon="eva:arrow-forward-fill" />,
                }}
                {...item}
                color="info"
                variant="soft"
              />
            )}
          />
        </ComponentBox>
      ),
    },
    {
      name: 'Table',
      component: (
        <ComponentBox sx={componentBoxStyles}>
          <TablePagination
            component="div"
            count={100}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </ComponentBox>
      ),
    },
    {
      name: 'Items',
      component: (
        <ComponentBox sx={componentBoxStyles}>
          <PaginationItems />
        </ComponentBox>
      ),
    },
  ];

  return (
    <ComponentLayout
      sectionData={DEMO_COMPONENTS}
      heroProps={{
        heading: 'Pagination',
        moreLinks: ['https://mui.com/material-ui/react-pagination/'],
      }}
    />
  );
}
