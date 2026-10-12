import { useState, useEffect } from "react";
import { 
  Search, 
  Globe, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Save, 
  ExternalLink,
  Sliders,
  Sparkles,
  Eye,
  Tag
} from "lucide-react";
import api from "../../utils/api";

const PAGES_CONFIG = [
  { id: "home", name: "Homepage", path: "/", icon: "🏠" },
  { id: "about", name: "About Us", path: "/about.htm", icon: "🏢" },
  { id: "products", name: "Products Catalog", path: "/products", icon: "🛒" },
  { id: "gas-refills", name: "Gas Refills", path: "/gas-refills", icon: "🔄" },
  { id: "contact", name: "Contact Us", path: "/contact.htm", icon: "📞" },
  { id: "services", name: "Services", path: "/services", icon: "🛠️" },
];

export default function AdminSEO() {
  const [seoList, setSeoList] = useState([]);
  const [activePageId, setActivePageId] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("google"); // "google" | "social"

  // Current page form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keywords: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    isIndexable: true,
  });

  // Fetch all SEO metadata on mount
  useEffect(() => {
    fetchSeoData();
  }, []);

  const fetchSeoData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/seo");
      if (res.data && res.data.success) {
        setSeoList(res.data.data);
        const active = res.data.data.find(p => p.pageId === activePageId) || res.data.data[0];
        if (active) {
          loadPageIntoForm(active);
        }
      }
    } catch (err) {
      console.error("Error loading SEO data:", err);
      setErrorMessage("Failed to load SEO metadata from server");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPageIntoForm = (page) => {
    setFormData({
      title: page.title || "",
      description: page.description || "",
      keywords: page.keywords || "",
      canonicalUrl: page.canonicalUrl || `https://conchgas.com${page.path === '/' ? '' : page.path}`,
      ogTitle: page.ogTitle || page.title || "",
      ogDescription: page.ogDescription || page.description || "",
      ogImage: page.ogImage || "https://conchgas.com/hero.jpg",
      isIndexable: page.isIndexable !== undefined ? page.isIndexable : true,
    });
    setSaveSuccess(false);
    setErrorMessage("");
  };

  const handleSelectPage = (pageId) => {
    setActivePageId(pageId);
    const selected = seoList.find(p => p.pageId === pageId);
    if (selected) {
      loadPageIntoForm(selected);
    } else {
      // Fallback empty form for this page
      const config = PAGES_CONFIG.find(p => p.id === pageId);
      setFormData({
        title: "",
        description: "",
        keywords: "",
        canonicalUrl: `https://conchgas.com${config?.path === '/' ? '' : config?.path}`,
        ogTitle: "",
        ogDescription: "",
        ogImage: "https://conchgas.com/hero.jpg",
        isIndexable: true,
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage("");

    try {
      const activeConfig = PAGES_CONFIG.find(p => p.id === activePageId);
      const payload = {
        ...formData,
        pageName: activeConfig?.name || activePageId,
        path: activeConfig?.path || "/",
      };

      const res = await api.put(`/seo/${activePageId}`, payload);
      if (res.data && res.data.success) {
        setSaveSuccess(true);
        // Update local list
        setSeoList(prev => {
          const idx = prev.findIndex(p => p.pageId === activePageId);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = res.data.data;
            return updated;
          }
          return [...prev, res.data.data];
        });
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Error saving SEO metadata:", err);
      setErrorMessage(err.response?.data?.message || "Failed to save SEO metadata");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm("Are you sure you want to reset all pages to default Conch Gas SEO tags? Any manual custom tags will be replaced.")) {
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.post("/seo/reset-defaults");
      if (res.data && res.data.success) {
        setSeoList(res.data.data);
        const active = res.data.data.find(p => p.pageId === activePageId);
        if (active) loadPageIntoForm(active);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Error resetting defaults:", err);
      setErrorMessage("Failed to reset SEO metadata to defaults");
    } finally {
      setIsLoading(false);
    }
  };

  const activePageConfig = PAGES_CONFIG.find(p => p.id === activePageId) || PAGES_CONFIG[0];
  const titleLength = formData.title.length;
  const descLength = formData.description.length;

  const keywordBadges = formData.keywords
    .split(",")
    .map(k => k.trim())
    .filter(Boolean);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        <span className="text-xs font-bold text-slate-500">Loading SEO Management...</span>
      </div>
    );
  }

  return (
    <div id="admin-seo-management" className="space-y-6 font-sans">
      
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Search size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">SEO Tags & Metadata Management</h1>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Manage meta titles, descriptions, keywords & social sharing previews for all website pages.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Reset to default Conch Gas SEO tags"
          >
            <RefreshCw size={14} />
            <span>Reset Defaults</span>
          </button>
          <a
            href={activePageConfig.path}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors"
          >
            <ExternalLink size={14} />
            <span>View Live Page</span>
          </a>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span className="text-xs font-bold">SEO metadata saved and applied successfully!</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-2xl flex items-center gap-3 animate-fadeIn">
          <AlertCircle size={18} className="text-red-600 shrink-0" />
          <span className="text-xs font-bold">{errorMessage}</span>
        </div>
      )}

      {/* 2. Main Grid: Left Page Selector, Center Form, Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Page Navigation List (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-2">
          <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-2 mb-2">
            Website Pages ({PAGES_CONFIG.length})
          </h3>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-2 shadow-sm space-y-1">
            {PAGES_CONFIG.map((page) => {
              const isSelected = page.id === activePageId;
              const hasCustom = seoList.some(p => p.pageId === page.id && p.title);
              return (
                <button
                  key={page.id}
                  onClick={() => handleSelectPage(page.id)}
                  type="button"
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-extrabold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-slate-700 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-sm">{page.icon}</span>
                    <span className="truncate">{page.name}</span>
                  </div>
                  {hasCustom && (
                    <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : "bg-emerald-500"}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Info Box */}
          <div className="bg-slate-900 text-slate-300 p-4 rounded-2xl text-xs space-y-2 border border-slate-800">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <Sparkles size={14} className="text-yellow-400" />
              <span>SEO Pro Tip</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Google typically displays the first <strong>50–60 characters</strong> of a title and <strong>150–160 characters</strong> of a description. Keep your main keywords at the beginning.
            </p>
          </div>
        </div>

        {/* Center Column: Edit Form (lg:col-span-5) */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>{activePageConfig.icon}</span>
                  <span>{activePageConfig.name}</span>
                </h2>
                <span className="text-[11px] font-mono font-semibold text-slate-400">
                  Path: {activePageConfig.path}
                </span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isIndexable}
                  onChange={(e) => setFormData({ ...formData, isIndexable: e.target.checked })}
                  className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-700">Index in Google</span>
              </label>
            </div>

            {/* Page Meta Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Page Meta Title <span className="text-red-500">*</span>
                </label>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  titleLength >= 50 && titleLength <= 60 
                    ? "bg-emerald-100 text-emerald-800" 
                    : titleLength > 60 
                    ? "bg-amber-100 text-amber-800" 
                    : "text-slate-400"
                }`}>
                  {titleLength}/60 chars
                </span>
              </div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Conch Gas Uganda | Fast & Safe LPG Cooking Gas Delivery Kampala"
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <p className="text-[10.5px] text-slate-400">Appears in browser tabs and as the main clickable headline in Google results.</p>
            </div>

            {/* Meta Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Meta Description <span className="text-red-500">*</span>
                </label>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  descLength >= 120 && descLength <= 160 
                    ? "bg-emerald-100 text-emerald-800" 
                    : descLength > 160 
                    ? "bg-amber-100 text-amber-800" 
                    : "text-slate-400"
                }`}>
                  {descLength}/160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Summary snippet for search results..."
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary leading-relaxed"
              />
              <p className="text-[10.5px] text-slate-400">Google snippet under the title. Briefly summarize the page and include a call to action.</p>
            </div>

            {/* Meta Keywords */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Meta Keywords <span className="text-slate-400 font-normal">(Comma separated)</span>
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="e.g. LPG gas, cooking gas Kampala, gas refill 13kg, Conch Gas"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {keywordBadges.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {keywordBadges.map((kw, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                      <Tag size={9} className="text-slate-400" />
                      <span>{kw}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Canonical URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Canonical URL</label>
              <input
                type="url"
                value={formData.canonicalUrl}
                onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                placeholder="https://conchgas.com/..."
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <p className="text-[10.5px] text-slate-400">Specifies the preferred URL to prevent duplicate content indexing.</p>
            </div>

            {/* OpenGraph Image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Social Share Image (OG:Image)</label>
              <input
                type="text"
                value={formData.ogImage}
                onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                placeholder="https://conchgas.com/hero.jpg"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <p className="text-[10.5px] text-slate-400">Preview image displayed when link is shared on WhatsApp, Facebook, Twitter.</p>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Save SEO for {activePageConfig.name}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Previews (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Preview Tabs */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-primary" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Live Result Preview</h3>
              </div>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab("google")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    activeTab === "google" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("social")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    activeTab === "social" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Social Share
                </button>
              </div>
            </div>

            {/* Google SERP Preview */}
            {activeTab === "google" && (
              <div className="space-y-3 font-sans">
                <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-5 h-5 rounded-full bg-[#BC0202] text-white flex items-center justify-center font-black text-[9px]">
                      C
                    </div>
                    <div className="truncate">
                      <span className="text-[11px] font-semibold text-slate-900 block truncate">Conch Gas Uganda</span>
                      <span className="text-[10px] text-slate-400 font-mono block truncate">
                        {formData.canonicalUrl || `https://conchgas.com${activePageConfig.path}`}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-[15px] font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-2">
                    {formData.title || "Page Title will appear here..."}
                  </h4>

                  <p className="text-[12px] text-[#4d5156] leading-relaxed line-clamp-3">
                    {formData.description || "Meta description snippet will appear here as shown in Google search results."}
                  </p>
                </div>
                <div className="text-[10.5px] text-slate-400 text-center font-medium">
                  {formData.isIndexable ? "🟢 Indexable by Google" : "🔴 NoIndex (Hidden from search engines)"}
                </div>
              </div>
            )}

            {/* Social Share / WhatsApp Card Preview */}
            {activeTab === "social" && (
              <div className="space-y-3">
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  {/* OG Image */}
                  <div className="h-36 bg-slate-100 flex items-center justify-center overflow-hidden relative">
                    <img
                      src={formData.ogImage || "/hero.jpg"}
                      alt="Social share preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/hero.jpg";
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                      OG:IMAGE
                    </div>
                  </div>

                  {/* OG Text */}
                  <div className="p-3 bg-slate-50/70 border-t border-slate-100 space-y-1">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 block tracking-wider font-mono">
                      CONCHGAS.COM
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {formData.title || "Page Title"}
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {formData.description || "Page description preview for WhatsApp, Facebook, iMessage and Twitter."}
                    </p>
                  </div>
                </div>
                <div className="text-[10.5px] text-slate-400 text-center font-medium">
                  Displayed when page link is shared on social media
                </div>
              </div>
            )}

          </div>

          {/* Page Path & Status Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900">Page Specifications</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Page Identifier:</span>
                <span className="font-mono font-bold text-slate-800">{activePageId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">URL Route:</span>
                <span className="font-mono font-bold text-primary">{activePageConfig.path}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Robots Status:</span>
                <span className="font-bold text-emerald-600">index, follow</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
