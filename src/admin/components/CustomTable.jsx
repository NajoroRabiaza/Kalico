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

// Bouton de suppression avec confirmation inline.
// Premier clic : passe en mode "confirming" avec timer 10s.
// Deuxieme clic : execute la suppression.
// Clic sur le backdrop ou expiration du timer : annule.
function DeleteButton({ onConfirm }) {
  const [confirming, setConfirming] = React.useState(false);
  const timerRef = React.useRef(null);

  const handleFirstClick = () => {
    setConfirming(true);
    timerRef.current = setTimeout(() => {
      setConfirming(false);
    }, 10000);
  };

  const handleConfirm = () => {
    clearTimeout(timerRef.current);
    setConfirming(false);
    onConfirm();
  };

  const handleCancel = () => {
    clearTimeout(timerRef.current);
    setConfirming(false);
  };

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  if (confirming) {
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Backdrop invisible qui couvre toute la page pour detecter le clic exterieur */}
        <div
          onClick={handleCancel}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10,
          }}
        />
        <Button
          size="small"
          variant="contained"
          onClick={handleConfirm}
          style={{ position: 'relative', zIndex: 11 }}
          sx={{
            textTransform: 'none',
            backgroundColor: '#dc2626',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            '&:hover': { backgroundColor: '#b91c1c' },
          }}
        >
          Supprimer vraiment ?
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="small"
      variant="outlined"
      onClick={handleFirstClick}
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
          minWidth: 180,
          align: 'center',
          isAction: true,
        },
      ]
    : columns;

  const rowsVisible = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (rows.length === 0) {
    return (
      <Paper sx={{ width: '100%' }}>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
              viewBox="0 0 24 24" fill="none" stroke="#94a3b8"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
            {emptyLabel || 'Aucune donnée disponible'}
          </p>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, textAlign: 'center' }}>
            Les nouvelles entrées apparaîtront ici dès qu'elles seront ajoutées.
          </p>
        </div>
      </Paper>
    );
  }

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
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                          {onEdit && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => onEdit(row)}
                              sx={{
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
                            <DeleteButton onConfirm={() => onDelete(row[uniqueKey])} />
                          )}
                        </div>
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
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} sur ${count !== -1 ? count : `plus de ${to}`}`
        }
      />
    </Paper>
  );
}