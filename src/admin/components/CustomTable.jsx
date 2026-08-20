import * as React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
} from '@mui/material';

export default function CustomTable({
  columns,
  rows,
  uniqueKey,
  onEdit,
  onDelete,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Quand les donnees changent (apres un delete ou un refresh),
  // on remet la page a 0 pour eviter de se retrouver sur une page vide
  React.useEffect(() => {
    setPage(0);
  }, [rows.length]);

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

  const rowsVisible = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ width: '100%' }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 260px)' }}>
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
            {rowsVisible.map((row, i) => (
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
                        : col.format && typeof value === 'number'
                        ? col.format(value)
                        : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Lignes par page"
      />
    </Paper>
  );
}
