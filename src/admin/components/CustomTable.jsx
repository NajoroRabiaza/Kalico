import * as React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';

export default function CustomTable({
  columns,
  rows,
  uniqueKey,
  onEdit,
  onDelete,
}) {
  const hasActions = onEdit || onDelete;

  const allColumns = hasActions
    ? [
        ...columns,
        {
          id: 'actions',
          label: 'Actions',
          minWidth: 150,
          align: 'center',
          isAction: true,
        },
      ]
    : columns;

  return (
    <Paper sx={{ width: '100%' }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {allColumns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  style={{ minWidth: col.minWidth || 100 }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
  {rows.map((row, i) => (
    <TableRow hover key={row[uniqueKey] || i}>
      {allColumns.map((col) => {
        if (col.isAction) {
          return (
            <TableCell key="actions" align="center">
              {onEdit && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onEdit(row)}
                  sx={{ mr: 1 }}
                >
                  Modifier
                </Button>
              )}
              {onDelete && (
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => onDelete(row[uniqueKey])}
                >
                  Retirer
                </Button>
              )}
            </TableCell>
          );
        }

        const value = row[col.id];
        return (
          <TableCell key={col.id} align={col.align || 'left'}>
            {col.render
              ? col.render(value, row)
              : (col.format && typeof value === 'number'
                  ? col.format(value)
                  : value)}
          </TableCell>
        );
      })}
    </TableRow>
  ))}
</TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
} 
