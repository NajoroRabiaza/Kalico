import API_URL from "../../api";
import { useEffect, useState } from 'react';
import CustomTable from '../components/CustomTable';
import { productsColumns as originalColumns } from '../data/productsData';
import {
  Modal, Box, Typography, TextField,
  Button, FormControlLabel, Checkbox
} from '@mui/material';

export default function Products() {
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProduits = () => {
    setLoading(true);
    fetch(`${API_URL}/produits`)
      .then(res => res.json())
      .then(data => {
        const produitsAvecTri = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRows(produitsAvecTri);
      })
      .catch(err => console.error("Erreur de chargement :", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct({
      nom: '', prix: '', quantite: '', description: '',
      categorie: '', menuSpecial: false, imgFile: null
    });
    setOpenModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
      imgFile: null,
      menuSpecial: product.menuSpecial || false
    });
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/produits/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur suppression");
      fetchProduits();
    } catch (err) {
      console.error("Erreur delete:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("nom", editingProduct.nom);
    formData.append("prix", editingProduct.prix);
    formData.append("quantite", editingProduct.quantite);
    formData.append("description", editingProduct.description);
    formData.append("categorie", editingProduct.categorie);
    formData.append("menuSpecial", editingProduct.menuSpecial);
    if (editingProduct.imgFile) {
      formData.append("img", editingProduct.imgFile);
    }

    try {
      const isEdit = !!editingProduct._id;
      const url = isEdit
        ? `${API_URL}/produits/${editingProduct._id}`
        : `${API_URL}/produits`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de la sauvegarde du produit");

      await fetchProduits();
      handleClose();
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  return (
    <>
      <Box sx={{ mb: 2, mt: 2, mr: 4, ml: 4, display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={fetchProduits}
          style={{
            padding: "6px 12px", backgroundColor: "#007bff",
            color: "white", border: "none", borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          🔄 Actualiser
        </button>
        <Button variant="contained" color="primary" onClick={handleOpenCreate}>
          Nouveau produit
        </Button>
      </Box>

      <CustomTable
        columns={originalColumns}
        rows={rows}
        uniqueKey="_id"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal open={openModal} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 430, bgcolor: 'background.paper',
          boxShadow: 24, p: 4, borderRadius: 2,
        }}>
          <Typography variant="h6" gutterBottom>
            {editingProduct?._id ? 'Modifier un produit' : 'Créer un produit'}
          </Typography>

          <TextField
            fullWidth label="Nom" name="nom" margin="normal"
            value={editingProduct?.nom || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth label="Prix" name="prix" margin="normal" type="number"
            value={editingProduct?.prix || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth label="Quantité" name="quantite" margin="normal" type="number"
            value={editingProduct?.quantite || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth label="Description" name="description" margin="normal"
            multiline rows={2}
            value={editingProduct?.description || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth label="Catégorie" name="categorie" margin="normal"
            value={editingProduct?.categorie || ''}
            onChange={handleChange}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="menuSpecial"
                checked={editingProduct?.menuSpecial || false}
                onChange={handleChange}
              />
            }
            label="Menu Spécial"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setEditingProduct((prev) => ({
                ...prev,
                imgFile: e.target.files[0],
              }))
            }
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleClose} sx={{ mr: 1 }}>Annuler</Button>
            <Button variant="contained" onClick={handleSave}>
              {editingProduct?._id ? "Mettre à jour" : "Créer"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}