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
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { grey, green, blue } from '@mui/material/colors';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { fDateTime, formatPatterns } from 'src/utils/format-time';

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

  const previewTable = useTable({ defaultOrderBy: 'createDate' });
  const resultTable = useTable({ defaultOrderBy: 'createDate' });

  const confirmDialog = useBoolean();

  const [statusProcess, setStatusProcess] = useState<'idle' | 'loading' | 'ready' | 'importing' | 'completed'>('idle');
  const [previewTableData, setPreviewTableData] = useState<IDdt[]>([]);
  const [resultTableData, setResultTableData] = useState<IDdt[]>([]);
  const [dateDownload, setDateDownload] = useState<Date | null>(null);
  const [dateImport, setDateImport] = useState<Date | null>(null);

  const previewFilters = useSetState<IDdtTableFilters>({
    name: '',
    status: 'all',
    shipments: [],
    orders: [],
  });
  const resultFilters = useSetState<IDdtTableFilters>({
    name: '',
    status: 'all',
    shipments: [],
    orders: [],
  });

  // Estraggo i due stati e relativi setter:
  const { state: currentPreviewFilters } = previewFilters;
  const { state: currentResultFilters, setState: updateResultFilters } = resultFilters;


  const previewDataFiltered = applyFilterFirst({
    inputData: previewTableData,
    comparator: getComparator(previewTable.order, previewTable.orderBy),
    filters: currentPreviewFilters,
  });

  const resultDataFiltered = applyFilterSecond({
    inputData: resultTableData,
    comparator: getComparator(resultTable.order, resultTable.orderBy),
    filters: currentResultFilters,
  });

  const handleDdtDownload = () => {
    setStatusProcess('loading');
    setTimeout(() => {
      setDateDownload(new Date());
      setPreviewTableData(_ddt);
      setStatusProcess('ready');
    }, 1500); // Simula download
  };

  const handleDdtImport = () => {
    setStatusProcess('importing');
    setTimeout(() => {
      setDateImport(new Date());
      setResultTableData(previewTableData);
      setStatusProcess('completed');
    }, 1500); // Simula importazione
  };

  const dataInPage = rowInPage(previewDataFiltered, previewTable.page, previewTable.rowsPerPage);

  const canResetPreview =
    !!currentPreviewFilters.name ||
    currentPreviewFilters.shipments.length > 0 ||
    currentPreviewFilters.orders.length > 0 ||
    currentPreviewFilters.status !== 'all';

  const canResetResult =
    !!currentResultFilters.name ||
    currentResultFilters.shipments.length > 0 ||
    currentResultFilters.orders.length > 0 ||
    currentResultFilters.status !== 'all';

  const notFoundPreview = (!previewDataFiltered.length && canResetPreview) || !previewDataFiltered.length;
  const notFoundResult = (!resultDataFiltered.length && canResetResult) || !resultDataFiltered.length;

  const getInvoiceLength = (status: string) =>
    previewTableData.filter((item) => item.status === status).length;

  const getTotalAmount = (status: string) =>
    sumBy(
      previewTableData.filter((item) => item.status === status),
      (invoice) => invoice.totalAmount
    );

  const getPercentByStatus = (status: string) =>
    (getInvoiceLength(status) / previewTableData.length) * 100;

  const TABS = [
    {
      value: 'all',
      label: 'All',
      color: 'default',
      count: previewTableData.length,
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
      const deleteRow = previewTableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setPreviewTableData(deleteRow);

      previewTable.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, previewTable, previewTableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = previewTableData.filter((row) => !previewTable.selected.includes(row.id));

    toast.success('Delete success!');

    setPreviewTableData(deleteRows);

    previewTable.onUpdatePageDeleteRows(dataInPage.length, previewDataFiltered.length);
  }, [previewDataFiltered.length, dataInPage.length, previewTable, previewTableData]);

  const handleDeleteResultsRow = useCallback(
    (id: string) => {
      const deleteRow = resultTableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setResultTableData(deleteRow);

      resultTable.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, resultTable, resultTableData]
  );

  const handleDeleteResultsRows = useCallback(() => {
    const deleteRows = resultTableData.filter((row) => !resultTable.selected.includes(row.id));

    toast.success('Delete success!');

    setResultTableData(deleteRows);

    resultTable.onUpdatePageDeleteRows(dataInPage.length, resultDataFiltered.length);
  }, [resultDataFiltered.length, dataInPage.length, resultTable, resultTableData]);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      resultTable.onResetPage();
      updateResultFilters({ status: newValue });
    },
    [updateResultFilters, resultTable]
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> {previewTable.selected.length} </strong> items?
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
          Are you sure want to delete <strong> {resultTable.selected.length} </strong> items?
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

  const renderAlertByStatus = () => {
    if (statusProcess === 'importing') {
      return (
        <Alert
          severity="info"
          variant="outlined"
          sx={{
            flexGrow: 1,
            borderRadius: 1,
          }}
        >
          Importazione in corso...
        </Alert >
      )
    } else if (statusProcess === 'completed') {
      return (
        <Alert
          severity="success"
          variant="outlined"
          sx={{
            flexGrow: 1,
            borderRadius: 1,
          }}
        >
          Importazione conclusa alle {`${fDateTime(dateImport, formatPatterns.italianTime)} del ${fDateTime(dateImport, formatPatterns.split.date)}`}
        </Alert >
      )
    } else {
      return (
        <Alert
          severity="info"
          variant="outlined"
          sx={{
            flexGrow: 1,
            bgcolor: grey[100],
            color: grey[700],
            border: `1px solid ${grey[200]}`,
            '& .MuiAlert-icon': {
              color: grey[600]
            },
            borderRadius: 1,
          }}
        >
          Nessuna importazione effettuata oggi.
        </Alert>
      );
    }
  }

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
            filters={previewFilters}
            onResetPage={previewTable.onResetPage}
            options={{ services: DDT_SERVICE_OPTIONS.map((option) => option.name) }}
          />

          {canResetPreview && (
            <ImportDdtTableFiltersResult
              filters={previewFilters}
              onResetPage={previewTable.onResetPage}
              totalResults={resultDataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={previewTable.dense}
              numSelected={previewTable.selected.length}
              rowCount={previewDataFiltered.length}
              onSelectAllRows={(checked) => {
                previewTable.onSelectAllRows(
                  checked,
                  previewDataFiltered.map((row) => row.id)
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
                {previewDataFiltered.length} DDT da importare | Ultimo aggiornamento {
                  (statusProcess === 'idle' || statusProcess === 'loading')
                    ? '-'
                    : fDateTime(dateDownload, formatPatterns.italianSplit.dateTime)
                }
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<Iconify icon="custom:send-fill" />}
                onClick={handleDdtDownload}
                disabled={statusProcess !== 'idle'}
              >
                Scarica DDT
              </Button>
            </Box>

            <Scrollbar sx={{ minHeight: 444 }}>

              <Table size={previewTable.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={previewTable.order}
                  orderBy={previewTable.orderBy}
                  headCells={TABLE_HEAD.filter((headCell) => headCell.label !== 'Status')}
                  rowCount={previewDataFiltered.length}
                  numSelected={previewTable.selected.length}
                  onSort={previewTable.onSort}
                  onSelectAllRows={(checked) =>
                    previewTable.onSelectAllRows(
                      checked,
                      previewDataFiltered.map((row) => row.id)
                    )
                  }
                />

                {statusProcess === 'idle' && (
                  <TableBody>
                    <ImportDdtEmptyTable
                      onDownload={handleDdtDownload}
                      columnsCount={TABLE_HEAD.length}
                    />
                  </TableBody>
                )}

                {statusProcess === 'loading' && (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={TABLE_HEAD.length} sx={{ height: 400 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                          <CircularProgress />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {statusProcess !== 'idle' && statusProcess !== 'loading' && (
                  <TableBody>
                    {previewDataFiltered
                      .slice(
                        previewTable.page * previewTable.rowsPerPage,
                        previewTable.page * previewTable.rowsPerPage + previewTable.rowsPerPage
                      )
                      .map((row) => (
                        <ImportDdtPreviewTableRow
                          key={row.id}
                          row={row}
                          selected={previewTable.selected.includes(row.id)}
                          onSelectRow={() => previewTable.onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          editHref={paths.dashboard.invoice.edit(row.id)}
                          detailsHref={paths.dashboard.invoice.details(row.id)}
                        />
                      ))}

                    <TableEmptyRows
                      height={previewTable.dense ? 56 : 56 + 20}
                      emptyRows={emptyRows(previewTable.page, previewTable.rowsPerPage, previewDataFiltered.length)}
                    />

                    <TableNoData notFound={notFoundPreview} />
                  </TableBody>
                )}

              </Table>

            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={previewTable.page}
            count={previewDataFiltered.length}
            rowsPerPage={previewTable.rowsPerPage}
            onPageChange={previewTable.onChangePage}
            onRowsPerPageChange={previewTable.onChangeRowsPerPage}
          />
        </Card>

        {/* ----------------------------------------------------------------------------------------------------------------------- */}
        <Box sx={{ mb: { xs: 3, md: 5 }, gap: 1, display: 'flex', alignItems: 'center' }}>
          {renderAlertByStatus()}
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Iconify icon="custom:send-fill" />}
            disabled={statusProcess !== 'ready'}
            onClick={handleDdtImport}
          >
            Importa DDT
          </Button>
        </Box>

        <Typography variant="h4" component="h4" sx={{ mb: { xs: 3, md: 5 } }}>
          Dettagli ultima importazione di oggi
        </Typography>

        {statusProcess !== 'completed' && statusProcess !== 'importing' && (
          <Typography variant="body1" component="div" sx={{ mb: { xs: 3, md: 5 }, fontStyle: 'italic' }}>
            Nessuna importazione oggi
          </Typography>
        )}

        {statusProcess === 'importing' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {statusProcess === 'completed' && (
          <>
            <Card sx={{ mb: { xs: 3, md: 5 } }}>
              <Scrollbar sx={{ minHeight: 108 }}>
                <Stack
                  divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                  sx={{ py: 2, flexDirection: 'row' }}
                >
                  <ImportDdtAnalytic
                    title="Total"
                    total={resultTableData.length}
                    percent={100}
                    price={sumBy(resultTableData, (invoice) => invoice.totalAmount)}
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
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" component="h2" sx={{ pl: 2.5, pt: 2.5, pb: 1 }}>
                  Importazione #231
                </Typography>
                <Typography variant="body2" component="span" sx={{ color: grey[600], pl: 2.5 }}>
                  {fDateTime(dateImport, formatPatterns.italianSplit.dateTime)}
                </Typography>
              </Box>

              <Tabs
                value={currentResultFilters.status}
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
                          ((tab.value === 'all' || tab.value === currentResultFilters.status) && 'filled') ||
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
                filters={resultFilters}
                onResetPage={resultTable.onResetPage}
                options={{ services: DDT_SERVICE_OPTIONS.map((option) => option.name) }}
              />

              {canResetResult && (
                <ImportDdtTableFiltersResult
                  filters={resultFilters}
                  onResetPage={resultTable.onResetPage}
                  totalResults={resultDataFiltered.length}
                  sx={{ p: 2.5, pt: 0 }}
                />
              )}

              <Box sx={{ position: 'relative' }}>
                <TableSelectedAction
                  dense={resultTable.dense}
                  numSelected={resultTable.selected.length}
                  rowCount={resultDataFiltered.length}
                  onSelectAllRows={(checked) => {
                    resultTable.onSelectAllRows(
                      checked,
                      resultDataFiltered.map((row) => row.id)
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
                  <Table size={resultTable.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                    <TableHeadCustom
                      order={resultTable.order}
                      orderBy={resultTable.orderBy}
                      headCells={TABLE_HEAD}
                      rowCount={resultDataFiltered.length}
                      numSelected={resultTable.selected.length}
                      onSort={resultTable.onSort}
                      onSelectAllRows={(checked) =>
                        resultTable.onSelectAllRows(
                          checked,
                          resultDataFiltered.map((row) => row.id)
                        )
                      }
                    />

                    <TableBody>
                      {resultDataFiltered
                        .slice(
                          resultTable.page * resultTable.rowsPerPage,
                          resultTable.page * resultTable.rowsPerPage + resultTable.rowsPerPage
                        )
                        .map((row) => (
                          <ImportDdtTableRow
                            key={row.id}
                            row={row}
                            selected={resultTable.selected.includes(row.id)}
                            onSelectRow={() => resultTable.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteResultsRow(row.id)}
                            editHref={paths.dashboard.invoice.edit(row.id)}
                            detailsHref={paths.dashboard.invoice.details(row.id)}
                          />
                        ))}

                      <TableEmptyRows
                        height={resultTable.dense ? 56 : 56 + 20}
                        emptyRows={emptyRows(resultTable.page, resultTable.rowsPerPage, resultDataFiltered.length)}
                      />

                      <TableNoData notFound={notFoundResult} />
                    </TableBody>
                  </Table>
                </Scrollbar>
              </Box>

              <TablePaginationCustom
                page={resultTable.page}
                count={resultDataFiltered.length}
                rowsPerPage={resultTable.rowsPerPage}
                onPageChange={resultTable.onChangePage}
                onRowsPerPageChange={resultTable.onChangeRowsPerPage}
              />
            </Card>
          </>
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