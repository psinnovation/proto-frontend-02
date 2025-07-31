import type { IDdt, IDdtTableFilters } from 'src/types/ddt';
import type { TableHeadCellProps } from 'src/components/table';

import { sumBy } from 'es-toolkit';
import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { grey, green } from '@mui/material/colors';

import { paths } from 'src/routes/paths';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { _ddt, DDT_SERVICE_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { ImportDdtAnalytic } from '../import-ddt-analytic';
import { ImportDdtTableRow } from '../import-ddt-table-row';
import { ImportDdtEmptyTable } from '../import-ddt-empty-table';
import { ImportDdtTableToolbar } from '../import-ddt-table-toolbar';
import { ImportDdtPreviewTableRow } from '../import-ddt-preview-table-row';
import { ImportDdtTableFiltersResult } from '../import-ddt-table-filters-result';

// ----------------------------------------------------------------------


const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'statusId', label: 'Status' },
  { id: 'ddtId', label: 'ID' },
  { id: 'creationDateId', label: 'Data creazione' },
  { id: 'movementTypeId', label: 'Tipo movimento' },
  { id: 'shippingId', label: 'ID spedizione' },
  { id: 'orderPrgId', label: 'Prg ordine' },
  { id: 'orderPrgLineId', label: 'Prg ordine riga' },
  { id: 'articleCodeId', label: 'Codice articolo' },
  { id: 'articleDescription', label: 'Descrizione articolo' },
  { id: '' },
];

export function ImportazioneView() {
  const theme = useTheme();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirmDialog = useBoolean();

  const [tableData, setTableData] = useState<IDdt[]>(_ddt);
  const [tableResults, setTableResults] = useState<IDdt[]>([]);

  const [isDdtDownloaded, setIsDdtDownloaded] = useState(false);
  const [isDdtImported, setIsDdtImported] = useState(false);

  const filters = useSetState<IDdtTableFilters>({
    name: '',
    status: 'all',
    shipments: [],
    orders: [],
  });
  const { state: currentFilters, setState: updateFilters } = filters;


  const dataFiltered = applyFilterFirst({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const receivedDataFiltered = applyFilterSecond({
    inputData: tableResults,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const handleDdtDownload = useCallback(() => {
    setIsDdtDownloaded(state => !state);
  }, []);

  const handleDdtImport = useCallback(() => {
    setIsDdtImported(state => !state);
    setTableResults(dataFiltered);
  }, [dataFiltered]);

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.name ||
    currentFilters.shipments.length > 0 ||
    currentFilters.orders.length > 0 ||
    currentFilters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLength = (status: string) =>
    tableData.filter((item) => item.status === status).length;

  const getTotalAmount = (status: string) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      (invoice) => invoice.totalAmount
    );

  const getPercentByStatus = (status: string) =>
    (getInvoiceLength(status) / tableData.length) * 100;

  const TABS = [
    {
      value: 'all',
      label: 'All',
      color: 'default',
      count: tableData.length,
    },
    {
      value: 'success',
      label: 'Success',
      color: 'success',
      count: getInvoiceLength('success'),
    },
    {
      value: 'error',
      label: 'Error',
      color: 'error',
      count: getInvoiceLength('error'),
    },
  ] as const;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleDeleteResultsRow = useCallback(
    (id: string) => {
      const deleteRow = tableResults.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableResults(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableResults]
  );

  const handleDeleteResultsRows = useCallback(() => {
    const deleteRows = tableResults.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableResults(deleteRows);

    table.onUpdatePageDeleteRows(dataInPage.length, receivedDataFiltered.length);
  }, [receivedDataFiltered.length, dataInPage.length, table, tableResults]);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> {table.selected.length} </strong> items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );

  const renderConfirmDialogResults = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> {table.selected.length} </strong> items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteResultsRows();
            confirmDialog.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Importazione DDT"
          links={[
            { name: 'Procedure', href: paths.dashboard.importDdt.root },
            { name: 'Import DDT', href: paths.dashboard.importDdt.root },
            { name: 'Esegui Importazione' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card sx={{ mb: { xs: 3, md: 5 } }}>

          <ImportDdtTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ services: DDT_SERVICE_OPTIONS.map((option) => option.name) }}
          />


          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) => {
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                );
              }}
              action={
                <Box sx={{ display: 'flex' }}>
                  <Tooltip title="Sent">
                    <IconButton color="primary">
                      <Iconify icon="custom:send-fill" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton color="primary">
                      <Iconify icon="solar:download-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Print">
                    <IconButton color="primary">
                      <Iconify icon="solar:printer-minimalistic-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirmDialog.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            />

            <Box sx={{ display: 'flex', marginLeft: 2.5, marginRight: 2.5, marginBottom: 2.5, gap: 1 }}>

              <Typography
                component="span"
                sx={{
                  flexGrow: 1,
                  color: grey[700],
                  border: `1px dashed ${grey[300]}`,
                  borderRadius: 1,
                  alignItems: 'center',
                  display: 'flex',
                  pl: 2,
                }}
              >
                20 DDT da importare | Ultimo aggiornamento 12/12/2022.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<Iconify icon="custom:send-fill" />}
                onClick={handleDdtDownload}
              >
                Scarica DDT
              </Button>
            </Box>

            <Scrollbar sx={{ minHeight: 444 }}>

              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD.filter((headCell) => headCell.label !== 'Status')}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />
                {isDdtDownloaded ? (
                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <ImportDdtPreviewTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          editHref={paths.dashboard.invoice.edit(row.id)}
                          detailsHref={paths.dashboard.invoice.details(row.id)}
                        />
                      ))}

                    <TableEmptyRows
                      height={table.dense ? 56 : 56 + 20}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                    />

                    <TableNoData notFound={notFound} />
                  </TableBody>
                ) : (
                  <TableBody>
                    <ImportDdtEmptyTable
                      onDownload={handleDdtDownload}
                      columnsCount={TABLE_HEAD.length}
                    />
                  </TableBody>
                )}
              </Table>

            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>

        {/* ----------------------------------------------------------------------------------------------------------------------- */}
        <Box sx={{ mb: { xs: 3, md: 5 }, gap: 1, display: 'flex', alignItems: 'center' }}>
          {isDdtImported && isDdtDownloaded ? (
            <Alert
              severity="success"
              sx={{
                flexGrow: 1,
                bgcolor: green[50],
                color: green[700],
                border: `1px solid ${green[100]}`,
                '& .MuiAlert-icon': {
                  color: green[600],
                  marginRight: 1,
                },
                borderRadius: 1,
              }}
            >
              Importazione conclusa alle 16:22
            </Alert>
          ) : (
            <Alert
              severity="info"
              sx={{
                flexGrow: 1,
                bgcolor: grey[100],
                color: grey[700],
                border: `1px solid ${grey[300]}`,
                '& .MuiAlert-icon': {
                  color: grey[600],
                  marginRight: 1,
                },
                borderRadius: 1,
              }}
            >
              Nessuna importazione effettuata oggi.
            </Alert>
          )}
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Iconify icon="custom:send-fill" />}
            disabled={!isDdtDownloaded}
            onClick={handleDdtImport}
          >
            Importa DDT
          </Button>
        </Box>

        <Typography variant="h4" component="h4" sx={{ mb: { xs: 3, md: 5 } }}>
          Dettagli ultima importazione di oggi
        </Typography>

        {isDdtImported && isDdtDownloaded ? (
          <>
            <Card sx={{ mb: { xs: 3, md: 5 } }}>
              <Scrollbar sx={{ minHeight: 108 }}>
                <Stack
                  divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                  sx={{ py: 2, flexDirection: 'row' }}
                >
                  <ImportDdtAnalytic
                    title="Total"
                    total={tableData.length}
                    percent={100}
                    price={sumBy(tableData, (invoice) => invoice.totalAmount)}
                    icon="solar:bill-list-bold-duotone"
                    color={theme.vars.palette.info.main}
                  />

                  <ImportDdtAnalytic
                    title="Success"
                    total={getInvoiceLength('success')}
                    percent={getPercentByStatus('success')}
                    price={getTotalAmount('success')}
                    icon="solar:file-check-bold-duotone"
                    color={theme.vars.palette.success.main}
                  />

                  <ImportDdtAnalytic
                    title="Error"
                    total={getInvoiceLength('error')}
                    percent={getPercentByStatus('error')}
                    price={getTotalAmount('error')}
                    icon="solar:bell-bing-bold-duotone"
                    color={theme.vars.palette.error.main}
                  />
                </Stack>
              </Scrollbar>
            </Card>

            <Card sx={{ mb: { xs: 3, md: 5 } }}>
              <Tabs
                value={currentFilters.status}
                onChange={handleFilterStatus}
                sx={{
                  px: 2.5,
                  boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
                }}
              >
                {TABS.map((tab) => (
                  <Tab
                    key={tab.value}
                    value={tab.value}
                    label={tab.label}
                    iconPosition="end"
                    icon={
                      <Label
                        variant={
                          ((tab.value === 'all' || tab.value === currentFilters.status) && 'filled') ||
                          'soft'
                        }
                        color={tab.color}
                      >
                        {tab.count}
                      </Label>
                    }
                  />
                ))}
              </Tabs>

              <ImportDdtTableToolbar
                filters={filters}
                onResetPage={table.onResetPage}
                options={{ services: DDT_SERVICE_OPTIONS.map((option) => option.name) }}
              />

              {canReset && (
                <ImportDdtTableFiltersResult
                  filters={filters}
                  onResetPage={table.onResetPage}
                  totalResults={receivedDataFiltered.length}
                  sx={{ p: 2.5, pt: 0 }}
                />
              )}

              <Box sx={{ position: 'relative' }}>
                <TableSelectedAction
                  dense={table.dense}
                  numSelected={table.selected.length}
                  rowCount={receivedDataFiltered.length}
                  onSelectAllRows={(checked) => {
                    table.onSelectAllRows(
                      checked,
                      receivedDataFiltered.map((row) => row.id)
                    );
                  }}
                  action={
                    <Box sx={{ display: 'flex' }}>
                      <Tooltip title="Sent">
                        <IconButton color="primary">
                          <Iconify icon="custom:send-fill" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Download">
                        <IconButton color="primary">
                          <Iconify icon="solar:download-bold" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Print">
                        <IconButton color="primary">
                          <Iconify icon="solar:printer-minimalistic-bold" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton color="primary" onClick={confirmDialog.onTrue}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                />

                <Scrollbar sx={{ minHeight: 444 }}>
                  <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                    <TableHeadCustom
                      order={table.order}
                      orderBy={table.orderBy}
                      headCells={TABLE_HEAD}
                      rowCount={receivedDataFiltered.length}
                      numSelected={table.selected.length}
                      onSort={table.onSort}
                      onSelectAllRows={(checked) =>
                        table.onSelectAllRows(
                          checked,
                          receivedDataFiltered.map((row) => row.id)
                        )
                      }
                    />

                    <TableBody>
                      {receivedDataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <ImportDdtTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteResultsRow(row.id)}
                            editHref={paths.dashboard.invoice.edit(row.id)}
                            detailsHref={paths.dashboard.invoice.details(row.id)}
                          />
                        ))}

                      <TableEmptyRows
                        height={table.dense ? 56 : 56 + 20}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, receivedDataFiltered.length)}
                      />

                      <TableNoData notFound={notFound} />
                    </TableBody>
                  </Table>
                </Scrollbar>
              </Box>

              <TablePaginationCustom
                page={table.page}
                count={receivedDataFiltered.length}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                onRowsPerPageChange={table.onChangeRowsPerPage}
              />
            </Card>
          </>
        ) : (
          <Typography variant="body1" component="div" sx={{ mb: { xs: 3, md: 5 }, fontStyle: 'italic' }}>
            Nessuna importazione oggi
          </Typography>
        )}

      </DashboardContent>

      {renderConfirmDialog()}
      {renderConfirmDialogResults()}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IDdt[];
  filters: IDdtTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilterFirst({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, status, shipments, orders } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(({ item }) =>
      [item?.code, item?.description].some((field) =>
        field?.toLowerCase().includes(name.toLowerCase())
      )
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((invoice) => invoice.status === status);
  }

  if (shipments.length) {
    inputData = inputData.filter((invoice) =>
      invoice.items.some((filterItem) => shipments.includes(filterItem.service))
    );
  }

  if (orders.length) {
    inputData = inputData.filter((invoice) =>
      invoice.items.some((filterItem) => orders.includes(filterItem.service))
    );
  }

  return inputData;
}

function applyFilterSecond({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, status, shipments, orders } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(({ item }) =>
      [item?.code, item?.description].some((field) =>
        field?.toLowerCase().includes(name.toLowerCase())
      )
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((invoice) => invoice.status === status);
  }

  if (shipments.length) {
    inputData = inputData.filter((invoice) =>
      invoice.items.some((filterItem) => shipments.includes(filterItem.service))
    );
  }

  if (orders.length) {
    inputData = inputData.filter((invoice) =>
      invoice.items.some((filterItem) => orders.includes(filterItem.service))
    );
  }

  return inputData;
}