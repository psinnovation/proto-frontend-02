import type { IDdt } from 'src/types/ddt';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime, formatPatterns } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
    row: IDdt;
    selected: boolean;
    editHref: string;
    detailsHref: string;
    onSelectRow: () => void;
    onDeleteRow: () => void;
};

export function ImportDdtPreviewTableRow({
    row,
    selected,
    editHref,
    onSelectRow,
    onDeleteRow,
    detailsHref
}: Props) {
    const menuActions = usePopover();
    const confirmDialog = useBoolean();

    const renderMenuActions = () => (
        <CustomPopover
            open={menuActions.open}
            anchorEl={menuActions.anchorEl}
            onClose={menuActions.onClose}
            slotProps={{ arrow: { placement: 'right-top' } }}
        >
            <MenuList>
                <li>
                    <MenuItem component={RouterLink} href={detailsHref} onClick={menuActions.onClose}>
                        <Iconify icon="solar:eye-bold" />
                        View
                    </MenuItem>
                </li>

                <li>
                    <MenuItem component={RouterLink} href={editHref} onClick={menuActions.onClose}>
                        <Iconify icon="solar:pen-bold" />
                        Edit
                    </MenuItem>
                </li>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem
                    onClick={() => {
                        confirmDialog.onTrue();
                        menuActions.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>
            </MenuList>
        </CustomPopover>
    );

    const renderConfirmDialog = () => (
        <ConfirmDialog
            open={confirmDialog.value}
            onClose={confirmDialog.onFalse}
            title="Delete"
            content="Are you sure want to delete?"
            action={
                <Button variant="contained" color="error" onClick={onDeleteRow}>
                    Delete
                </Button>
            }
        />
    );

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox
                        checked={selected}
                        onClick={onSelectRow}
                        slotProps={{
                            input: {
                                id: `${row.id}-checkbox`,
                                'aria-label': `${row.id} checkbox`,
                            },
                        }}
                    />
                </TableCell>

                <TableCell>{row.id}</TableCell>

                <TableCell align="center">
                    <ListItemText
                        primary={fDate(row.createDate)}
                        secondary={fTime(row.createDate, formatPatterns.italianTime)}
                        slotProps={{
                            primary: { noWrap: true, sx: { typography: 'body2' } },
                            secondary: { sx: { mt: 0.5, typography: 'caption' } },
                        }}
                    />
                </TableCell>

                <TableCell align="center">{row.movementType}</TableCell>

                <TableCell align="center">{row.shipment?.id}</TableCell>

                <TableCell align="center">{row.order?.number}</TableCell>
            
                <TableCell align="center">{row.order?.lineNumber}</TableCell>

                <TableCell align="center">{row.item?.code}</TableCell>

                <TableCell align="center">{row.item?.description}</TableCell>

                <TableCell align="right" sx={{ px: 1 }}>
                    <IconButton color={menuActions.open ? 'inherit' : 'default'} onClick={menuActions.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            {renderMenuActions()}
            {renderConfirmDialog()}
        </>
    );
}
