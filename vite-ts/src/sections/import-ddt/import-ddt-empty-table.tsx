import { grey } from '@mui/material/colors';
import { Box, Button, TableCell, TableRow, Typography } from '@mui/material';

import UploadIllustration from 'src/assets/illustrations/upload-illustration';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface ImportDdtEmptyTableProps {
    onDownload: () => void;
    columnsCount: number;
}

export function ImportDdtEmptyTable({ onDownload, columnsCount }: ImportDdtEmptyTableProps) {
    return (
        <TableRow>
            <TableCell colSpan={columnsCount}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 444,
                        py: 5,
                    }}
                >
                    <UploadIllustration />
                    <Typography variant="body1" sx={{ mt: 3, textAlign: 'center', color: grey[700] }}>
                        Nessun DDT da importare.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<Iconify icon="custom:send-fill" />}
                        onClick={onDownload}
                        sx={{ mt: 3 }}
                    >
                        Scarica DDT
                    </Button>
                </Box>
            </TableCell>
        </TableRow>
    );
}
