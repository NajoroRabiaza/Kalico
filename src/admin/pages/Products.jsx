import API_URL from "../../api";
import authFetch from "../../utils/authFetch";
import { useEffect, useState, useRef } from "react";
import CustomTable from "../components/CustomTable";
import { productsColumns as originalColumns } from "../data/productsData";
import {
  Modal, Box, Typography, FormControlLabel, Checkbox, Button
} from "@mui/material";

// Champ de formulaire avec label fixe au-dessus — cohérent entre création et modification
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{
        display: 'block',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#475569',
        marginBottom: '0.35rem',
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '0.875rem',
  color: '#1e293b',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s',
};

export default function Products() {
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProduits = () => {
    setLoading(true);
    fetch(`${API_URL}/produits`)
      .then((res) => res.json())
      .then((data) => setRows(data))
      .catch((err) => console.error("Erreur de chargement :", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct({
      nom: "", prix: "", quantite: "", description: "",
      categorie: "", menuSpecial: false, imgFile: null,
    });
    setOpenModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct({ ...product, imgFile: null, menuSpecial: product.menuSpecial || false });
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setEditingProduct(null);
    setDragOver(false);
  };

  const handleDelete = async (id) => {
    try {
      const res = await authFetch(`${API_URL}/produits/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur suppression");
      fetchProduits();
    } catch (err) {
      console.error("Erreur delete:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setEditingProduct((prev) => ({ ...prev, imgFile: file }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
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

      const res = await authFetch(url, { method, body: formData });
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde du produit");
      await fetchProduits();
      handleClose();
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  const isEdit = !!editingProduct?._id;

  return (
    <>
      {/* Barre d'actions au-dessus du tableau */}
      <Box sx={{
        mb: 2, mt: 2, mr: 4, ml: 4,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Button
          onClick={fetchProduits}
          disabled={loading}
          variant="outlined"
          size="small"
          sx={{
            borderColor: "#e2e8f0",
            color: "#475569",
            backgroundColor: "#ffffff",
            textTransform: "none",
            fontSize: "0.8rem",
            fontWeight: 500,
            "&:hover": { backgroundColor: "#f8fafc", borderColor: "#cbd5e1" },
          }}
          startIcon={
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
          }
        >
          Actualiser
        </Button>

        <Button
          variant="contained"
          onClick={handleOpenCreate}
          size="small"
          sx={{
            backgroundColor: "#e65d0d",
            textTransform: "none",
            fontSize: "0.8rem",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(230, 93, 13, 0.25)",
            "&:hover": {
              backgroundColor: "#cf5209",
              boxShadow: "0 2px 12px rgba(230, 93, 13, 0.35)",
            },
          }}
          startIcon={
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          }
        >
          Nouveau produit
        </Button>
      </Box>

      <CustomTable
        columns={originalColumns}
        rows={rows}
        uniqueKey="_id"
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyLabel="Aucun produit pour le moment"
      />

      {/* Modale création / modification */}
      <Modal open={openModal} onClose={handleClose}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 460,
          bgcolor: "background.paper",
          borderRadius: "12px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          outline: "none",
          maxHeight: "90vh",
          overflowY: "auto",
        }}>
          {/* En-tete de la modale */}
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 16px",
            borderBottom: "1px solid #f1f5f9",
          }}>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b" }}>
              {isEdit ? "Modifier un produit" : "Créer un produit"}
            </Typography>
            {/* Bouton fermeture X */}
            <button
              type="button"
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </Box>

          {/* Corps du formulaire */}
          <Box sx={{ padding: "20px 24px" }}>
            <Field label="Nom du produit">
              <input
                style={inputStyle}
                name="nom"
                placeholder="ex : Soupe légume"
                value={editingProduct?.nom || ""}
                onChange={handleChange}
              />
            </Field>

            {/* Champ prix avec suffixe Ar */}
            <Field label="Prix">
              <div style={{ position: 'relative' }}>
                <input
                  style={{ ...inputStyle, paddingRight: '36px' }}
                  name="prix"
                  type="number"
                  placeholder="0"
                  value={editingProduct?.prix || ""}
                  onChange={handleChange}
                />
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#94a3b8',
                  pointerEvents: 'none',
                }}>
                  Ar
                </span>
              </div>
            </Field>

            <Field label="Quantité">
              <input
                style={inputStyle}
                name="quantite"
                type="number"
                placeholder="0"
                value={editingProduct?.quantite || ""}
                onChange={handleChange}
              />
            </Field>

            <Field label="Description">
              <textarea
                style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }}
                name="description"
                placeholder="Ingrédients, allergènes..."
                value={editingProduct?.description || ""}
                onChange={handleChange}
              />
            </Field>

            <Field label="Catégorie">
              <input
                style={inputStyle}
                name="categorie"
                placeholder="ex : soupe, plat principal..."
                value={editingProduct?.categorie || ""}
                onChange={handleChange}
              />
            </Field>

            <FormControlLabel
              control={
                <Checkbox
                  name="menuSpecial"
                  checked={editingProduct?.menuSpecial || false}
                  onChange={handleChange}
                  size="small"
                  sx={{ color: '#e65d0d', '&.Mui-checked': { color: '#e65d0d' } }}
                />
              }
              label={
                <span style={{ fontSize: '0.875rem', color: '#475569' }}>
                  Menu Spécial
                </span>
              }
              sx={{ mb: 1 }}
            />

            {/* Zone d'upload image drag-and-drop */}
            <Field label="Image du produit">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragOver ? '#e65d0d' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: dragOver ? '#fff4ee' : '#f8fafc',
                  transition: 'all 0.2s',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                  viewBox="0 0 24 24" fill="none"
                  stroke={dragOver ? '#e65d0d' : '#94a3b8'}
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  style={{ marginBottom: '8px' }}>
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
                <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0, fontWeight: 500 }}>
                  {editingProduct?.imgFile
                    ? editingProduct.imgFile.name
                    : "Cliquez ou glissez une image ici"}
                </p>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '4px 0 0' }}>
                  PNG, JPG jusqu'à 5 Mo
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
            </Field>
          </Box>

          {/* Pied de modale */}
          <Box sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            padding: "16px 24px 20px",
            borderTop: "1px solid #f1f5f9",
          }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'none',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: '#64748b',
                cursor: 'pointer',
              }}
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSave}
              style={{
                padding: '9px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#e65d0d',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(230, 93, 13, 0.3)',
              }}
            >
              {isEdit ? "Mettre à jour" : "Créer"}
            </button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}