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

function EmptyState({ label }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      gap: '0.75rem',
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        backgroundColor: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>
      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
        {label || 'Aucune donnée disponible'}
      </p>
      <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, textAlign: 'center' }}>
        Les nouvelles entrées apparaîtront ici dès qu'elles seront ajoutées.
      </p>
    </div>
  );
}

export default function CustomTable({
  columns,
  rows,
  uniqueKey,
  onEdit,
  onDelete,
  emptyLabel,
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
      {rows.length === 0 ? (
        <EmptyState label={emptyLabel} />
      ) : (
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
                              sx={{
                                mr: 1,
                                textTransform: 'none',
                                borderColor: '#e2e8f0',
                                color: '#475569',
                                '&:hover': {
                                  backgroundColor: '#f8fafc',
                                  borderColor: '#cbd5e1',
                                },
                              }}
                            >
                              Modifier
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => onDelete(row[uniqueKey])}
                              sx={{
                                textTransform: 'none',
                                borderColor: '#fecaca',
                                color: '#dc2626',
                                '&:hover': {
                                  backgroundColor: '#fef2f2',
                                  borderColor: '#f87171',
                                },
                              }}
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
      )}

      {rows.length > 0 && (
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
      )}
    </Paper>
  );
}