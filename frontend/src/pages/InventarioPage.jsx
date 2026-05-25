// ─────────────────────────────────────────────────────────────
// pages/InventarioPage.jsx
// Gestión de inventario: búsqueda, filtros, tabla y paginación.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect }                      from "react";
import { Plus, Search, Edit2, Trash2, AlertTriangle, X } from "lucide-react";
import Badge                                         from "../components/ui/Badge";
import { cardClass, btnPrimary, inputClass }        from "../styles/theme";
import { stockBadgeClass }                          from "../utils/badges";
import { inventarioData }                           from "../constants/data";
import { getProducts, getCategories, createProduct } from "../services/api";

const PER_PAGE = 6;
const STORAGE_KEY = "smartlogix_inventario";

export default function InventarioPage({ user }) {
  const [inventario, setInventario] = useState(inventarioData);
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch]           = useState("");
  const [filtro, setFiltro]           = useState("todos"); // "todos" | "bajo"
  const [page,   setPage]             = useState(1);
  const [isFormOpen, setIsFormOpen]   = useState(false);
  const [isEditOpen, setIsEditOpen]   = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formError, setFormError]     = useState("");
  const [loading, setLoading]         = useState(true);
  const [newProduct, setNewProduct]   = useState({
    producto: "",
    sku: "",
    categoriaId: 0,
    stock: "",
    estado: "Normal",
  });

  // Cargar categorías y productos del backend
  useEffect(() => {
    async function loadData() {
      try {
        const [categoriasData, productosData] = await Promise.all([
          getCategories(),
          getProducts(user),
        ]);
        
        if (categoriasData && categoriasData.length > 0) {
          setCategorias(categoriasData);
        } else {
          // Fallback a categorías por defecto si la API falla
          setCategorias([
            { id: 1, nombre: "Electrónica", descripcion: "" },
            { id: 2, nombre: "Accesorios", descripcion: "" },
            { id: 3, nombre: "Cables", descripcion: "" },
            { id: 4, nombre: "Otros", descripcion: "" },
          ]);
        }

        if (productosData && productosData.length > 0) {
          // Mapear productos desde API al formato esperado
          const mappedProducts = productosData.map(p => ({
            id: p.id,
            producto: p.name,
            sku: p.sku,
            categoria: p.categoriaNombre,
            stock: p.stock,
            estado: p.estado,
          }));
          setInventario(mappedProducts);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        // Si falla, usar categorías por defecto
        setCategorias([
          { id: 1, nombre: "Electrónica", descripcion: "" },
          { id: 2, nombre: "Accesorios", descripcion: "" },
          { id: 3, nombre: "Cables", descripcion: "" },
          { id: 4, nombre: "Otros", descripcion: "" },
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Cargar desde localStorage como fallback
  useEffect(() => {
    if (inventario.length === 0) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setInventario(parsed);
          }
        } catch (error) {
          console.warn("Inventario localStorage inválido", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (inventario.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inventario));
    }
  }, [inventario]);

  const filtered = inventario.filter((p) => {
    const matchText =
      p.producto.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    if (filtro === "bajo")
      return matchText && (p.estado === "Bajo" || p.estado === "Crítico");
    return matchText;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const shown      = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleSearch(value) {
    setSearch(value);
    setPage(1);
  }
  function handleFiltro(value) {
    setFiltro(value);
    setPage(1);
  }

  function openForm() {
    setFormError("");
    setNewProduct({
      producto: "",
      sku: "",
      categoriaId: categorias.length > 0 ? categorias[0].id : 0,
      stock: "",
      estado: "Normal",
    });
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setFormError("");
  }

  function openEditProduct(product) {
    setEditingProduct({...product});
    setIsEditOpen(true);
    setFormError("");
  }

  function closeEditProduct() {
    setIsEditOpen(false);
    setEditingProduct(null);
    setFormError("");
  }

  async function handleDeleteProduct(productId) {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      return;
    }
    try {
      // Eliminar del estado local
      setInventario((current) => current.filter((p) => p.id !== productId));
    } catch (error) {
      setFormError("Error al eliminar el producto: " + error.message);
    }
  }

  async function handleSaveEditProduct(event) {
    event?.preventDefault();
    const { producto, sku, categoria, stock, estado } = editingProduct;

    if (!producto.trim() || !sku.trim() || !categoria || !stock.toString().trim() || !estado.trim()) {
      setFormError("Debes completar todos los campos.");
      return;
    }

    const stockValue = Number(stock);
    if (Number.isNaN(stockValue) || stockValue < 0) {
      setFormError("El stock debe ser un número válido mayor o igual a 0.");
      return;
    }

    try {
      // Actualizar en el estado local
      setInventario((current) =>
        current.map((p) => p.id === editingProduct.id ? editingProduct : p)
      );
      closeEditProduct();
    } catch (error) {
      setFormError("Error al actualizar el producto: " + error.message);
    }
  }

  function handleProductChange(field, value) {
    setNewProduct((current) => ({ ...current, [field]: value }));
  }

  async function handleAddProduct(event) {
    event?.preventDefault();
    const { producto, sku, categoriaId, stock, estado } = newProduct;

    if (!producto.trim() || !sku.trim() || !categoriaId || !stock.toString().trim() || !estado.trim()) {
      setFormError("Debes completar todos los campos.");
      return;
    }

    const stockValue = Number(stock);
    if (Number.isNaN(stockValue) || stockValue < 0) {
      setFormError("El stock debe ser un número válido mayor o igual a 0.");
      return;
    }

    try {
      const producto_obj = {
        name: producto.trim(),
        sku: sku.trim(),
        categoriaId: Number(categoriaId),
        stock: stockValue,
        estado: estado.trim(),
        marca: "",
        precio: 0,
      };

      await createProduct(producto_obj, user);

      // Recargar productos desde API
      const updated = await getProducts(user);
      const mappedProducts = updated.map(p => ({
        id: p.id,
        producto: p.name,
        sku: p.sku,
        categoria: p.categoriaNombre,
        stock: p.stock,
        estado: p.estado,
      }));
      setInventario(mappedProducts);
      setIsFormOpen(false);
    } catch (error) {
      setFormError("Error al guardar el producto: " + error.message);
    }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-center py-10">
          <p className="text-slate-400">Cargando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Inventario</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {inventario.length} productos en sistema
          </p>
        </div>
        <button className={btnPrimary} onClick={openForm}>
          <Plus size={16} /> Agregar Producto
        </button>
      </div>

      {/* Barra de herramientas: búsqueda + filtros */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Buscador */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar producto o SKU..."
            className={`${inputClass} pl-9`}
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          {[
            { key: "todos", label: "Todos" },
            { key: "bajo",  label: "⚠ Stock Bajo" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleFiltro(key)}
              className={`text-sm px-3 py-2 rounded-xl border transition-colors
                ${filtro === key
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className={`${cardClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-800/50">
                {["Producto", "SKU", "Categoría", "Stock", "Estado", "Acciones"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs text-slate-500 font-medium px-5 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                >
                  <td className="px-5 py-3.5 text-white font-medium">{p.producto}</td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">{p.sku}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{p.categoria}</td>
                  {/* Stock con alerta visual */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${
                          p.stock < 5
                            ? "text-red-400"
                            : p.stock < 10
                            ? "text-amber-400"
                            : "text-white"
                        }`}
                      >
                        {p.stock}
                      </span>
                      {p.stock < 10 && (
                        <AlertTriangle
                          size={13}
                          className={p.stock < 5 ? "text-red-400" : "text-amber-400"}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge label={p.estado} className={stockBadgeClass(p.estado)} />
                  </td>
                  {/* Acciones */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditProduct(p)} className="p-1.5 text-slate-500 hover:text-blue-400
                                         hover:bg-blue-400/10 rounded-lg transition-colors" title="Editar producto">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 text-slate-500 hover:text-red-400
                                         hover:bg-red-400/10 rounded-lg transition-colors" title="Eliminar producto">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-700/50">
          <span className="text-xs text-slate-500">{filtered.length} resultados</span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 text-xs rounded-lg transition-colors
                  ${page === i + 1
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-700"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className={`${cardClass} w-full max-w-2xl p-6 relative`}>
            <button
              onClick={closeForm}
              className="absolute top-4 right-4 text-slate-500 hover:text-white p-2 rounded-lg transition-colors"
              aria-label="Cerrar formulario"
            >
              <X size={18} />
            </button>

            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">Agregar nuevo producto</h2>
              <p className="text-slate-500 text-sm mt-1">Rellena los datos completos para crear un elemento en inventario.</p>
            </div>

            <form onSubmit={handleAddProduct} className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                Nombre del producto
                <input
                  value={newProduct.producto}
                  onChange={(e) => handleProductChange("producto", e.target.value)}
                  className={inputClass}
                  placeholder="Nombre del producto"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                SKU
                <input
                  value={newProduct.sku}
                  onChange={(e) => handleProductChange("sku", e.target.value)}
                  className={inputClass}
                  placeholder="SKU del producto"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Categoría
                <select
                  value={newProduct.categoriaId}
                  onChange={(e) => handleProductChange("categoriaId", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Stock
                <input
                  value={newProduct.stock}
                  onChange={(e) => handleProductChange("stock", e.target.value)}
                  className={inputClass}
                  type="number"
                  min="0"
                  placeholder="Cantidad en stock"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
                Estado
                <select
                  value={newProduct.estado}
                  onChange={(e) => handleProductChange("estado", e.target.value)}
                  className={inputClass}
                >
                  <option value="Normal">Normal</option>
                  <option value="Bajo">Bajo</option>
                  <option value="Crítico">Crítico</option>
                </select>
              </label>

              {formError && (
                <div className="sm:col-span-2 bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl">
                  {formError}
                </div>
              )}

              <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`${btnPrimary} w-full sm:w-auto justify-center`}
                >
                  Guardar producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className={`${cardClass} w-full max-w-2xl p-6 relative`}>
            <button
              onClick={closeEditProduct}
              className="absolute top-4 right-4 text-slate-500 hover:text-white p-2 rounded-lg transition-colors"
              aria-label="Cerrar formulario"
            >
              <X size={18} />
            </button>

            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">Editar producto</h2>
              <p className="text-slate-500 text-sm mt-1">Actualiza los datos del producto.</p>
            </div>

            <form onSubmit={handleSaveEditProduct} className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                Nombre del producto
                <input
                  value={editingProduct.producto}
                  onChange={(e) => setEditingProduct({...editingProduct, producto: e.target.value})}
                  className={inputClass}
                  placeholder="Nombre del producto"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                SKU
                <input
                  value={editingProduct.sku}
                  onChange={(e) => setEditingProduct({...editingProduct, sku: e.target.value})}
                  className={inputClass}
                  placeholder="SKU del producto"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Categoría
                <select
                  value={editingProduct.categoria || ""}
                  onChange={(e) => setEditingProduct({...editingProduct, categoria: e.target.value})}
                  className={inputClass}
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Stock
                <input
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({...editingProduct, stock: Number(e.target.value)})}
                  className={inputClass}
                  type="number"
                  min="0"
                  placeholder="Cantidad en stock"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
                Estado
                <select
                  value={editingProduct.estado}
                  onChange={(e) => setEditingProduct({...editingProduct, estado: e.target.value})}
                  className={inputClass}
                >
                  <option value="Normal">Normal</option>
                  <option value="Bajo">Bajo</option>
                  <option value="Crítico">Crítico</option>
                </select>
              </label>

              {formError && (
                <div className="sm:col-span-2 bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl">
                  {formError}
                </div>
              )}

              <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditProduct}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`${btnPrimary} w-full sm:w-auto justify-center`}
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
