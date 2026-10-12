import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  FolderKanban, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Image as ImageIcon, 
  X, 
  Layers, 
  DollarSign, 
  Info, 
  ArrowUpDown,
  Check,
  AlertTriangle,
  Flame,
  Upload,
  Loader2,
  ShieldCheck,
  Award,
  Sparkles
} from "lucide-react";
import api from "../../utils/api";

export default function AdminProducts() {
  const [activeTab, setActiveTab] = useState("products"); // 'products' | 'categories'

  // Products state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productSearch, setProductSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = new product
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const [productForm, setProductForm] = useState({
    title: "",
    slug: "",
    categorySlug: "",
    price: "",
    originalPrice: "",
    weight: "",
    desc: "",
    images: ["", "", "", "", ""],
    inStock: true,
    isBestSeller: false,
    weightGuarantee: true,
    unbsCertified: true,
    specifications: [{ key: "", value: "" }],
    order: 0,
    isActive: true
  });

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    order: 0,
    isActive: true
  });

  // Form submission & feedback
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Delete confirmations
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'product'|'category', id: '', name: '' }

  // Fetch initial data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get("/products?all=true"),
        api.get("/categories?all=true")
      ]);

      if (prodRes.data && prodRes.data.success) {
        setProducts(prodRes.data.data || []);
      }
      if (catRes.data && catRes.data.success) {
        setCategories(catRes.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching products/categories:", err);
      setFeedback({ type: "error", message: "Failed to load products and categories." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Clear feedback after 4 seconds
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => setFeedback({ type: "", message: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // ─────────────────────────────────────────────────────────────
  // Product Helpers & Actions
  // ─────────────────────────────────────────────────────────────
  const openNewProductModal = () => {
    if (categories.length === 0) {
      setFeedback({ type: "error", message: "Please create at least one Category before adding products." });
      setIsCatModalOpen(true);
      return;
    }
    setEditingProduct(null);
    const defaultCat = categories[0]?.slug || "";
    setProductForm({
      title: "",
      slug: "",
      categorySlug: defaultCat,
      price: "",
      originalPrice: "",
      weight: "",
      desc: "",
      images: ["", "", "", "", ""],
      inStock: true,
      isBestSeller: false,
      weightGuarantee: true,
      unbsCertified: true,
      customBadges: [],
      newBadgeInput: "",
      specifications: [{ key: "", value: "" }],
      order: products.length + 1,
      isActive: true
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod) => {
    setEditingProduct(prod);
    const existingImages = [...(prod.images || [])];
    while (existingImages.length < 5) existingImages.push("");

    const existingSpecs = prod.specifications && prod.specifications.length > 0 
      ? prod.specifications.map(s => ({ key: s.key || "", value: s.value || "" }))
      : [{ key: "", value: "" }];

    setProductForm({
      title: prod.title || prod.name || "",
      slug: prod.slug || "",
      categorySlug: prod.categorySlug || categories[0]?.slug || "",
      price: prod.price !== undefined ? prod.price : "",
      originalPrice: prod.originalPrice !== undefined ? prod.originalPrice : "",
      weight: prod.weight || "",
      desc: prod.desc || prod.description || "",
      images: existingImages.slice(0, 5),
      inStock: prod.inStock !== undefined ? prod.inStock : true,
      isBestSeller: Boolean(prod.isBestSeller),
      weightGuarantee: prod.weightGuarantee !== undefined ? prod.weightGuarantee : true,
      unbsCertified: prod.unbsCertified !== undefined ? prod.unbsCertified : true,
      customBadges: Array.isArray(prod.customBadges) ? [...prod.customBadges] : (prod.customBadge ? [prod.customBadge] : []),
      newBadgeInput: "",
      specifications: existingSpecs,
      order: prod.order || 0,
      isActive: prod.isActive !== undefined ? prod.isActive : true
    });
    setIsProductModalOpen(true);
  };

  const handleProductTitleChange = (val) => {
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setProductForm(prev => ({
      ...prev,
      title: val,
      // Only auto-update slug if we are creating new product or slug matches old title slug
      slug: editingProduct ? prev.slug : autoSlug
    }));
  };

  const handleImageChange = (index, value) => {
    setProductForm(prev => {
      const newImages = [...prev.images];
      newImages[index] = value;
      return { ...prev, images: newImages };
    });
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    try {
      setUploadingSlot(index);
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data && res.data.url) {
        handleImageChange(index, res.data.url);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleAddSpecRow = () => {
    setProductForm(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }]
    }));
  };

  const handleRemoveSpecRow = (idx) => {
    setProductForm(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== idx)
    }));
  };

  const handleSpecChange = (idx, field, val) => {
    setProductForm(prev => {
      const updated = [...prev.specifications];
      updated[idx][field] = val;
      return { ...prev, specifications: updated };
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.title.trim()) {
      alert("Please provide product title");
      return;
    }

    try {
      setIsSaving(true);
      const cleanedImages = productForm.images.map(img => img.trim()).filter(Boolean);
      const cleanedSpecs = productForm.specifications.filter(s => s.key.trim() && s.value.trim());

      const payload = {
        title: productForm.title.trim(),
        slug: productForm.slug.trim(),
        categorySlug: productForm.categorySlug,
        price: Number(productForm.price) || 0,
        originalPrice: Number(productForm.originalPrice) || 0,
        weight: productForm.weight.trim(),
        desc: productForm.desc.trim(),
        images: cleanedImages.length > 0 ? cleanedImages : ["/conch_cylinders_range.png"],
        inStock: productForm.inStock,
        isBestSeller: productForm.isBestSeller,
        weightGuarantee: Boolean(productForm.weightGuarantee),
        unbsCertified: Boolean(productForm.unbsCertified),
        customBadges: (productForm.customBadges || []).map(b => b.trim()).filter(Boolean),
        customBadge: (productForm.customBadges && productForm.customBadges.length > 0) ? productForm.customBadges[0].trim() : "",
        specifications: cleanedSpecs,
        order: Number(productForm.order) || 0,
        isActive: productForm.isActive
      };

      if (editingProduct) {
        const res = await api.put(`/products/${editingProduct._id}`, payload);
        if (res.data && res.data.success) {
          setProducts(prev => prev.map(p => p._id === editingProduct._id ? res.data.data : p));
          setFeedback({ type: "success", message: `Updated "${payload.title}" successfully!` });
        }
      } else {
        const res = await api.post("/products", payload);
        if (res.data && res.data.success) {
          setProducts(prev => [res.data.data, ...prev]);
          setFeedback({ type: "success", message: `Product "${payload.title}" created successfully!` });
        }
      }

      setIsProductModalOpen(false);
    } catch (err) {
      console.error("Error saving product:", err);
      const errMsg = err.response?.data?.message || "Failed to save product.";
      alert(errMsg);
    } finally {
      setIsSaving(false);
    }
  };



  // ─────────────────────────────────────────────────────────────
  // Category Helpers & Actions
  // ─────────────────────────────────────────────────────────────
  const openNewCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      slug: "",
      description: "",
      order: categories.length + 1,
      isActive: true
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      order: cat.order || 0,
      isActive: cat.isActive !== undefined ? cat.isActive : true
    });
    setIsCategoryModalOpen(true);
  };

  const handleCategoryNameChange = (val) => {
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setCategoryForm(prev => ({
      ...prev,
      name: val,
      slug: editingCategory ? prev.slug : autoSlug
    }));
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      alert("Please provide category name");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        name: categoryForm.name.trim(),
        slug: categoryForm.slug.trim(),
        description: categoryForm.description.trim(),
        order: Number(categoryForm.order) || 0,
        isActive: categoryForm.isActive
      };

      if (editingCategory) {
        const res = await api.put(`/categories/${editingCategory._id}`, payload);
        if (res.data && res.data.success) {
          setCategories(prev => prev.map(c => c._id === editingCategory._id ? res.data.data : c));
          setFeedback({ type: "success", message: `Category "${payload.name}" updated!` });
        }
      } else {
        const res = await api.post("/categories", payload);
        if (res.data && res.data.success) {
          setCategories(prev => [...prev, res.data.data]);
          setFeedback({ type: "success", message: `Category "${payload.name}" created!` });
        }
      }

      setIsCategoryModalOpen(false);
    } catch (err) {
      console.error("Error saving category:", err);
      const errMsg = err.response?.data?.message || "Failed to save category.";
      alert(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Delete Handler
  // ─────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsSaving(true);
      if (deleteTarget.type === "product") {
        await api.delete(`/products/${deleteTarget.id}`);
        setProducts(prev => prev.filter(p => p._id !== deleteTarget.id));
        setFeedback({ type: "success", message: `Deleted product "${deleteTarget.name}".` });
      } else if (deleteTarget.type === "category") {
        await api.delete(`/categories/${deleteTarget.id}`);
        setCategories(prev => prev.filter(c => c._id !== deleteTarget.id));
        setFeedback({ type: "success", message: `Deleted category "${deleteTarget.name}".` });
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.message || "Delete failed.");
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategoryFilter === "all" || p.categorySlug === selectedCategoryFilter;
    const matchesSearch = !productSearch || 
      (p.title || p.name || "").toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.slug || "").toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.desc || "").toLowerCase().includes(productSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* ═══════════════════════════════════════
          HEADER BANNER & TAB SELECTOR
      ═══════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-red-50 text-[#BC0202]">
              <Package size={22} />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
              Products & Categories CMS
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Manage your store catalog, 5-image galleries, UGX prices, and mega-menu categories.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "products"
                ? "bg-white text-[#BC0202] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Package size={14} />
            <span>Products ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "categories"
                ? "bg-white text-[#BC0202] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FolderKanban size={14} />
            <span>Categories ({categories.length})</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback.message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all shadow-xs ${
          feedback.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {feedback.type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════
          TAB 1: PRODUCTS MANAGER
      ═══════════════════════════════════════ */}
      {activeTab === "products" && (
        <div className="space-y-4">
          
          {/* Controls: Search, Category Filter, Add Button */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products by title, slug, description..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-[#BC0202] focus:bg-white transition-all"
                />
              </div>

              {/* Category Filter Dropdown */}
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#BC0202]"
              >
                <option value="all">All Categories ({products.length})</option>
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={openNewProductModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Add Product</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#BC0202] mx-auto mb-3" />
                <p className="text-xs font-semibold">Loading product catalog...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-12 text-center">
                <Package size={40} className="text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">No products found</h3>
                <p className="text-xs text-slate-400 mt-1">Try adjusting search or add your first product.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price (UGX)</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => {
                      const primaryImg = p.images && p.images[0] ? p.images[0] : "/conch_cylinders_range.png";

                      return (
                        <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center overflow-hidden flex-shrink-0">
                                <img
                                  src={primaryImg}
                                  alt={p.title}
                                  className="w-full h-full object-contain p-1"
                                  onError={(e) => { e.currentTarget.src = "/conch_cylinders_range.png"; }}
                                />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 hover:text-[#BC0202] transition-colors">
                                  {p.title || p.name}
                                </h4>
                                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                                  <span>slug: /{p.slug}</span>
                                  {p.weight && <span>• {p.weight}</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 font-semibold text-[11px]">
                              {p.categoryName || p.categorySlug}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            UGX {Number(p.price || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                to={`/products/${p.slug}`}
                                target="_blank"
                                title="View Live Product Page"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-[#BC0202] hover:bg-red-50 transition-colors"
                              >
                                <ExternalLink size={14} />
                              </Link>
                              <button
                                onClick={() => openEditProductModal(p)}
                                title="Edit Product"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: "product", id: p._id, name: p.title || p.name })}
                                title="Delete Product"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          TAB 2: CATEGORIES MANAGER
      ═══════════════════════════════════════ */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Mega Menu & Header Categories</h3>
              <p className="text-xs text-slate-500">Categories define the mega-menu columns and catalog sections.</p>
            </div>
            <button
              onClick={openNewCategoryModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, idx) => {
              const catProducts = products.filter(p => p.categorySlug === cat.slug);

              return (
                <div key={cat._id || idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-8 h-8 rounded-xl bg-red-50 text-[#BC0202] flex items-center justify-center font-black text-xs">
                        #{cat.order || idx + 1}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cat.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {cat.isActive ? "Active" : "Hidden"}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{cat.name}</h4>
                    <p className="text-xs text-[#BC0202] font-mono mt-0.5">/{cat.slug}</p>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                      {cat.description || "No description specified."}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">
                      {catProducts.length} Products
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditCategoryModal(cat)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: "category", id: cat._id, name: cat.name })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          MODAL: ADD / EDIT PRODUCT (UP TO 5 IMAGES)
      ═══════════════════════════════════════ */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingProduct ? `Edit Product: ${editingProduct.title || editingProduct.name}` : "Create New Product"}
                </h3>
                <p className="text-xs text-slate-500">Provide details, pricing in UGX, and up to 5 image assets.</p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Conch Smart Double Burner Stove"
                    value={productForm.title}
                    onChange={(e) => handleProductTitleChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#BC0202]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Slug (URL Key) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. conch-smart-double-burner-stove"
                    value={productForm.slug}
                    onChange={(e) => setProductForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:border-[#BC0202]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={productForm.categorySlug}
                    onChange={(e) => setProductForm(prev => ({ ...prev, categorySlug: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-[#BC0202]"
                  >
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Selling Price & Original Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Selling Price (UGX) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">UGX</span>
                    <input
                      type="number"
                      required
                      placeholder="98000"
                      value={productForm.price}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full pl-12 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-[#BC0202]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Original Price (UGX) <span className="text-slate-400 font-normal lowercase">(for SAVE badge)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">UGX</span>
                    <input
                      type="number"
                      placeholder="e.g. 115000"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                      className="w-full pl-12 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-[#BC0202]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Weight / Capacity
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6 KG, 13 KG, 4.8 KG, 500g"
                    value={productForm.weight}
                    onChange={(e) => setProductForm(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#BC0202]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={productForm.order}
                    onChange={(e) => setProductForm(prev => ({ ...prev, order: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#BC0202]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Product Description
                  </label>
                  <span className="text-[10.5px] text-slate-400 font-medium">
                    (Press Enter for paragraph / line spaces)
                  </span>
                </div>
                <textarea
                  rows={5}
                  placeholder="Detailed description of features, compatibility, materials... Use Enter for paragraph spaces."
                  value={productForm.desc}
                  onChange={(e) => setProductForm(prev => ({ ...prev, desc: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#BC0202]"
                />
              </div>

              {/* Images Management with Direct File Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-[#BC0202]" />
                      <span>Product Images (Up to 5 Images)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Aap 1 se lekar 5 tak jitni chahein utni images daal sakte hain. Jitni upload karenge sirf utni hi frontend par render hongi.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-[#BC0202]">
                    Max 5 Slots
                  </span>
                </div>

                <div className="space-y-3">
                  {productForm.images.map((imgUrl, i) => (
                    <div key={i} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                      
                      {/* Slot badge & Preview Thumbnail */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider shrink-0 ${
                          i === 0 ? "bg-[#BC0202] text-white" : "bg-slate-100 text-slate-600"
                        }`}>
                          {i === 0 ? "Cover (1)" : `#${i + 1}`}
                        </span>

                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={`Slot ${i + 1}`}
                              className="w-full h-full object-contain p-0.5"
                              onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                          ) : (
                            <ImageIcon size={16} className="text-slate-300" />
                          )}
                        </div>
                      </div>

                      {/* URL input */}
                      <input
                        type="text"
                        placeholder={`Image ${i + 1} URL (e.g. /6kg.jpg, https://... or click Upload File)`}
                        value={imgUrl}
                        onChange={(e) => handleImageChange(i, e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:outline-none focus:border-[#BC0202]"
                      />

                      {/* File Upload Button & Clear */}
                      <div className="flex items-center gap-2 shrink-0">
                        <label className={`cursor-pointer px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          uploadingSlot === i 
                            ? "bg-slate-200 text-slate-500 cursor-not-allowed" 
                            : "bg-slate-900 hover:bg-[#BC0202] text-white shadow-2xs"
                        }`}>
                          {uploadingSlot === i ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Upload size={13} />
                          )}
                          <span>{uploadingSlot === i ? "Uploading..." : "Upload File"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingSlot === i}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload(i, e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                        </label>

                        {imgUrl && (
                          <button
                            type="button"
                            onClick={() => handleImageChange(i, "")}
                            title="Clear this image slot"
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X size={15} />
                          </button>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Specifications */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Specifications & Features
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#BC0202] hover:underline"
                  >
                    <Plus size={12} />
                    <span>Add Row</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {productForm.specifications.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Feature / Key (e.g. Cylinder Weight, Valve Standard)"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(sIdx, "key", e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-[#BC0202]"
                      />
                      <input
                        type="text"
                        placeholder="Specification Value (e.g. 6 KG Net Gas, Unified Pin Valve)"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(sIdx, "value", e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-[#BC0202]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecRow(sIdx)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges & Toggles */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Product Badges & Visibility
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={productForm.weightGuarantee}
                      onChange={(e) => setProductForm(prev => ({ ...prev, weightGuarantee: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#BC0202] focus:ring-[#BC0202]"
                    />
                    <ShieldCheck size={14} className="text-[#BC0202]" />
                    <span>100% Weight Guarantee Badge</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={productForm.unbsCertified}
                      onChange={(e) => setProductForm(prev => ({ ...prev, unbsCertified: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#BC0202] focus:ring-[#BC0202]"
                    />
                    <Award size={14} className="text-[#BC0202]" />
                    <span>UNBS Certified Safety Badge</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={productForm.isBestSeller}
                      onChange={(e) => setProductForm(prev => ({ ...prev, isBestSeller: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#BC0202] focus:ring-[#BC0202]"
                    />
                    <span>Best Seller (Gold Star Badge)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) => setProductForm(prev => ({ ...prev, inStock: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#BC0202] focus:ring-[#BC0202]"
                    />
                    <span>Product is in Stock</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer bg-white p-2.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={productForm.isActive}
                      onChange={(e) => setProductForm(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#BC0202] focus:ring-[#BC0202]"
                    />
                    <span>Active & Visible in Catalog</span>
                  </label>

                  {/* 6th Option: Custom Badges Status Card */}
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-[#BC0202]" />
                      <span>Custom Badges ({productForm.customBadges?.length || 0})</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#BC0202] bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                      + Add Below
                    </span>
                  </div>
                </div>

                {/* 6th Option Manager: Naye Badges Add Karein */}
                <div className="mt-2.5 p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#BC0202]" />
                      <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                        Custom Badges / Naye Badges ({productForm.customBadges?.length || 0})
                      </span>
                    </div>
                    <span className="text-[10.5px] text-slate-400 font-medium">
                      Press Enter or click Add to save badge
                    </span>
                  </div>

                  {/* Existing Custom Badges Pills */}
                  {productForm.customBadges && productForm.customBadges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {productForm.customBadges.map((badge, bIdx) => (
                        <span 
                          key={bIdx} 
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200/90 text-[#BC0202] text-xs font-bold shadow-2xs"
                        >
                          <span>{badge}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setProductForm(prev => ({
                                ...prev,
                                customBadges: prev.customBadges.filter((_, i) => i !== bIdx)
                              }));
                            }}
                            className="text-red-400 hover:text-red-700 p-0.5 rounded-full hover:bg-red-100 transition-colors cursor-pointer"
                            title="Remove badge"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Add New Badge Input Form */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Type badge name (e.g. Doorstep Exchange, Free Inspection, 1 Year Warranty)..."
                      value={productForm.newBadgeInput || ""}
                      onChange={(e) => setProductForm(prev => ({ ...prev, newBadgeInput: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = (productForm.newBadgeInput || "").trim();
                          if (val && !productForm.customBadges?.includes(val)) {
                            setProductForm(prev => ({
                              ...prev,
                              customBadges: [...(prev.customBadges || []), val],
                              newBadgeInput: ""
                            }));
                          }
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#BC0202]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = (productForm.newBadgeInput || "").trim();
                        if (val && !productForm.customBadges?.includes(val)) {
                          setProductForm(prev => ({
                            ...prev,
                            customBadges: [...(prev.customBadges || []), val],
                            newBadgeInput: ""
                          }));
                        }
                      }}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-[#BC0202] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 shadow-2xs"
                    >
                      <Plus size={13} />
                      <span>Add Badge</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          MODAL: ADD / EDIT CATEGORY
      ═══════════════════════════════════════ */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Category"}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Industrial Gas, Gas Accessories"
                  value={categoryForm.name}
                  onChange={(e) => handleCategoryNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#BC0202]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category Slug *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. industrial-gas"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:border-[#BC0202]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of items in this category"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#BC0202]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Order Priority
                  </label>
                  <input
                    type="number"
                    value={categoryForm.order}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, order: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#BC0202]"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryForm.isActive}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#BC0202] focus:ring-[#BC0202]"
                    />
                    <span>Active in Menu</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          DELETE CONFIRMATION MODAL
      ═══════════════════════════════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Delete {deleteTarget.type === "product" ? "Product" : "Category"}?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete <span className="font-bold text-slate-800">"{deleteTarget.name}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isSaving}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isSaving ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
