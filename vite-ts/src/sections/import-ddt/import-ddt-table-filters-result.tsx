import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { IDdtTableFilters } from 'src/types/ddt';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  onResetPage: () => void;
  filters: UseSetStateReturn<IDdtTableFilters>;
};

export function ImportDdtTableFiltersResult({ filters, totalResults, onResetPage, sx }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    updateFilters({ name: '' });
  }, [onResetPage, updateFilters]);

  const handleRemoveShipments = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.shipments.filter((item) => item !== inputValue);

      onResetPage();
      updateFilters({ shipments: newValue });
    },
    [onResetPage, updateFilters, currentFilters.shipments]
  );

  const handleRemoveOrders = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.orders.filter((item) => item !== inputValue);

      onResetPage();
      updateFilters({ orders: newValue });
    },
    [onResetPage, updateFilters, currentFilters.orders]
  );

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    updateFilters({ status: 'all' });
  }, [onResetPage, updateFilters]);

  return (
    <FiltersResult totalResults={totalResults} onReset={() => resetFilters()} sx={sx}>
      <FiltersBlock label="Shipments:" isShow={!!currentFilters.shipments.length}>
        {currentFilters.shipments.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveShipments(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Orders:" isShow={!!currentFilters.orders.length}>
        {currentFilters.orders.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveOrders(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Status:" isShow={currentFilters.status !== 'all'}>
        <Chip
          {...chipProps}
          label={currentFilters.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!currentFilters.name}>
        <Chip {...chipProps} label={currentFilters.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
