import { useState, useEffect } from "react";
import { 
  Mail, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MailOpen, 
  CheckCircle, 
  User,
  Calendar,
  Trash2,
  Info,
  Phone,
  PackagePlus,
  ArrowRight,
  X
} from "lucide-react";
import api from "../../utils/api";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Convert modal states
  const [selectedContact, setSelectedContact] = useState(null);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({});
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Open "Convert to Order" Wizard
  const openConvertWizard = (contact) => {
    setSelectedContact(contact);
    setOrderForm({
      contactInquiry: contact._id,
      bookingRef: "",
      // Sender
      senderName: contact.fullName || contact.name || "",
      senderPhone: contact.phone || "",
      senderEmail: contact.email || "",
      senderPickupDate: "",
      senderPickupAddress: "",
      // Receiver
      receiverName: "",
      receiverPhone: "",
      receiverEmail: "",
      medicineUsedFor: "Domestic Cooking",
      receiverDeliveryAddress: "",
      // Legacy / backend required
      customerName: contact.fullName || contact.name || "",
      customerEmail: contact.email || "",
      customerPhone: contact.phone || "",
      customerAddress: "",
      originCity: "",
      originAddress: "",
      destinationCountry: "",
      destinationCountryCode: "",
      destinationAddress: "",
      destinationCity: "",
      medicineType: "",
      weight: 0.5,
      basePrice: 0,
      finalPrice: 0,
      paymentStatus: "pending",
      status: "booking_confirmed",
      currentLocation: "",
      courierPartner: "",
      courierTrackingId: "",
      estimatedDelivery: "",
      notes: `Converted from contact inquiry ref: ${contact._id}. Original message: ${contact.message || ""}`
    });
    setSaveError("");
    setIsConvertModalOpen(true);
  };

  // Submit Converted Order
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setSaveError("");
    setIsSaving(true);
    try {
      const res = await api.post("/orders", orderForm);
      if (res.data && res.data.success) {
        setIsConvertModalOpen(false);
        // Mark contact as read once converted
        await api.put(`/contacts/${selectedContact._id}`, { status: "read" });
        fetchContacts();
      }
    } catch (err) {
      console.error("Conversion failed:", err);
      setSaveError(err.response?.data?.message || "Failed to create shipment order.");
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch contacts list
  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const params = {
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter || undefined
      };
      const contactsRes = await api.get("/contacts", { params });
      if (contactsRes.data && contactsRes.data.success) {
        setContacts(contactsRes.data.data || []);
        setPagination(contactsRes.data.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchContacts();
  };

  // Toggle status read/unread
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "read" ? "unread" : "read";
    try {
      const res = await api.put(`/contacts/${id}`, { status: newStatus });
      if (res.data && res.data.success) {
        // Update local state instead of full fetch for fast feedback
        setContacts(prev => prev.map(c => c._id === id ? { ...c, status: newStatus } : c));
      }
    } catch (err) {
      console.error("Error updating contact status:", err);
      alert("Failed to update status.");
    }
  };

  // Soft delete contact
  const handleDeleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const res = await api.delete(`/contacts/${id}`);
      if (res.data && res.data.success) {
        fetchContacts();
      }
    } catch (err) {
      console.error("Error deleting contact:", err);
      alert("Failed to delete inquiry.");
    }
  };


  return (
    <div id="admin-contacts-page" className="space-y-4 font-sans">
      
      <div className="space-y-6 animate-fadeIn">
          {/* 1. Header Filters */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                id="contacts-search-input"
                type="text"
                placeholder="Search sender name, email, message body..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/70 hover:border-slate-350 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
              />
            </form>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Status:</span>
              </div>
              <select
                id="contacts-status-filter"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="bg-slate-50 border border-slate-200/70 focus:outline-none focus:ring-1 focus:ring-primary px-3 py-2 rounded-xl text-xs font-bold text-slate-700 transition-all"
              >
                <option value="">All Inquiries</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>

          </div>

          {/* 2. Grid of Cards */}
          {isLoading ? (
            <div className="bg-white border border-slate-200/60 rounded-3xl py-20 flex flex-col items-center justify-center gap-3 shadow-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <span className="text-xs font-semibold text-slate-500">Retrieving visitor queries...</span>
            </div>
          ) : contacts.length === 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-3xl py-20 text-center text-slate-500 shadow-sm">
              <Mail className="mx-auto text-slate-200 mb-3" size={48} />
              <p className="text-sm font-bold text-slate-800">No contact messages found</p>
              <p className="text-xs text-slate-400 mt-1">Inbox is clean! Check back later.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {contacts.map((contact) => (
                  <div 
                    key={contact._id} 
                    className={`bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative ${
                      contact.status === "unread" ? "ring-1 ring-primary/10 border-primary/20" : ""
                    }`}
                  >
                    {/* Badge Status indicator */}
                    {contact.status === "unread" && (
                      <span className="absolute top-5 right-5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}

                    {/* Sender details */}
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                          <User size={15} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-extrabold text-slate-900 truncate">{contact.fullName || contact.name || "—"}</h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">{contact.email}</p>
                        </div>
                      </div>

                      {/* Phone and Date info */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-slate-500 font-semibold border-b border-slate-50 pb-3">
                        <span className="flex items-center gap-1">
                          <Phone size={12} className="text-slate-400 shrink-0" />
                          {contact.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400 shrink-0" />
                          {new Date(contact.createdAt).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      {/* Message body */}
                      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
                        <p className="text-xs text-slate-600 leading-relaxed font-semibold italic whitespace-pre-wrap">
                          "{contact.message}"
                        </p>
                      </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(contact._id, contact.status)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase transition-all ${
                            contact.status === "read"
                              ? "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                              : "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 shadow-sm"
                          }`}
                        >
                          {contact.status === "read" ? (
                            <>
                              <MailOpen size={12} />
                              Mark Unread
                            </>
                          ) : (
                            <>
                              <CheckCircle size={12} />
                              Mark Read
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteContact(contact._id)}
                        className="p-2 border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-lg transition-colors shrink-0"
                        title="Delete Inquiry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="bg-white border border-slate-200/60 rounded-3xl px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                  <span className="text-xs font-bold text-slate-400">
                    Showing page {pagination.page} of {pagination.pages} ({pagination.total} entries)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage(prev => prev - 1)}
                      className="p-2 border border-slate-200/80 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      disabled={page >= pagination.pages}
                      onClick={() => setPage(prev => prev + 1)}
                      className="p-2 border border-slate-200/80 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      {/* Convert To Order Modal Wizard */}
      {isConvertModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/70 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scaleUp">
            
            {/* Modal Header */}
            <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-slate-50/50">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                Convert Contact Inquiry to Active Order
              </h3>
              <button 
                onClick={() => setIsConvertModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Error notifications */}
            {saveError && (
              <div className="bg-red-500/10 border-b border-red-500/20 text-red-500 px-6 py-3 text-xs font-semibold flex items-center gap-2">
                <Info size={14} />
                <span>{saveError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreateOrder} className="flex-1 overflow-y-auto flex flex-col justify-between">
              
              <div className="p-6 space-y-8">

                 {/* ─── SENDER DETAILS ─── */}
                 <div>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200">Sender Details</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div className="space-y-1">
                       <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Name *</label>
                       <input
                         type="text"
                         placeholder="Your Full Name"
                         value={orderForm.senderName || ""}
                         onChange={(e) => setOrderForm({ ...orderForm, senderName: e.target.value, customerName: e.target.value })}
                         className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary focus:outline-none px-3 py-2.5 rounded-xl text-xs font-semibold"
                         required
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Contact Number *</label>
                       <input
                         type="text"
                         placeholder="10 Digit Mobile No"
                         value={orderForm.senderPhone || ""}
                         onChange={(e) => setOrderForm({ ...orderForm, senderPhone: e.target.value, customerPhone: e.target.value })}
                         className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary focus:outline-none px-3 py-2.5 rounded-xl text-xs font-semibold"
                         required
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Email Address</label>
                       <input
                         type="email"
                         placeholder="Email address"
                         value={orderForm.senderEmail || ""}
                         onChange={(e) => setOrderForm({ ...orderForm, senderEmail: e.target.value, customerEmail: e.target.value })}
                         className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary focus:outline-none px-3 py-2.5 rounded-xl text-xs font-semibold"
                       />
                     </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                     <div className="space-y-1">
                       <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Pick Up Date *</label>
                       <input
                         type="date"
                         value={orderForm.senderPickupDate || ""}
                         onChange={(e) => setOrderForm({ ...orderForm, senderPickupDate: e.target.value })}
                         className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary focus:outline-none px-3 py-2.5 rounded-xl text-xs font-semibold"
                         required
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Pick Up Address with Pin Code *</label>
                       <input
                         type="text"
                         placeholder="Enter complete pickup street details and pin code"
                         value={orderForm.senderPickupAddress || ""}
                         onChange={(e) => setOrderForm({ ...orderForm, senderPickupAddress: e.target.value, originAddress: e.target.value, customerAddress: e.target.value })}
                         className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary focus:outline-none px-3 py-2.5 rounded-xl text-xs font-semibold"
                         required
                       />
                     </div>
                   </div>
                 </div>

                 {/* ─── RECEIVER DETAILS ─── */}
                 <div>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200">Receiver Details</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div className="space-y-1">
                       <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Name *</label>
                       <input
                         type="text"
                         placeholder="Receiver Full Name"
                         value={orderForm.receiverName || ""}
                         onChange={(e) => setOrderForm({ ...orderForm, receiverName: e.target.value })}
                         className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary focus:outline-none px-3 py-2.5 rounded-xl text-xs font-semibold"
                         required
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Contact Number *</label>
                       <input
                         type="text"
                         placeholder="10 Digit Mobile No"
                         value={orderForm.receiverPhone || ""}
                         onChange={(e) => setOrderForm({ ...orderForm, receiverPhone: e.target.value })}
                         className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary focus:outline-none px-3 py-2.5 rounded-xl text-xs font-semibold"
                         required
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Email Address</label>
                       <input
                         type="email"
                         placeholder="Email address"
                         value={orderForm.receiverEmail || ""}
                         onChange={(e) => setOrderForm({ ...orderForm, receiverEmail: e.target.value })}
                         className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary focus:outline-none px-3 py-2.5 rounded-xl text-xs font-semibold"
                       />
                     </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                     <div className="space-y-1">
                       <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Order Purpose / Usage *</label>
                       <select
                         value={orderForm.medicineUsedFor || "Domestic Cooking"}
                         onChange={(e) => setOrderForm({ ...orderForm, medicineUsedFor: e.target.value })}
                         className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary focus:outline-none px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700"
                         required
                       >
                         <option>Domestic Cooking</option>
                          <option>Restaurant / Commercial Kitchen</option>
                          <option>Hotel & Hospitality</option>
                          <option>Industrial Facility</option>
                          <option>Cylinder Refill (Exchange)</option>
                          <option>New Complete Connection</option>
                          <option>Bulk Gas Supply</option>
                          <option>Other Usage</option>
                       </select>
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Doorstep Delivery Address *</label>
                       <input
                         type="text"
                         placeholder="Enter complete delivery street address in Kampala / Uganda"
                         value={orderForm.receiverDeliveryAddress || ""}
                         onChange={(e) => setOrderForm({ ...orderForm, receiverDeliveryAddress: e.target.value, destinationAddress: e.target.value })}
                         className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary focus:outline-none px-3 py-2.5 rounded-xl text-xs font-semibold"
                         required
                       />
                     </div>
                   </div>
                 </div>

                 {/* ─── CARGO SPECS & PRICING ─── */}
                 <div>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200">Cylinder Specs & Pricing</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                     <div className="space-y-1">
                       <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Gas / Cylinder Type</label>
                       <input
                         type="text"
                         placeholder="e.g. 13 KG LPG Cooking Gas"
                         value={orderForm.medicineType || ""}
                         onChange={(e) => setOrderForm({ ...orderForm, medicineType: e.target.value })}
                         className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary focus:outline-none px-3 py-2.5 rounded-xl text-xs font-semibold capitalize"
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Weight (Kg)</label>
                       <input
                         type="number"
                         step={0.5}
                         min={0.5}
                         value={orderForm.weight || 0.5}
                         onChange={(e) => setOrderForm({ ...orderForm, weight: parseFloat(e.target.value) || 0.5 })}
                         className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary focus:outline-none px-3 py-2.5 rounded-xl text-xs font-semibold"
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Charged Price (UGX)</label>
                       <input
                         type="number"
                         value={orderForm.finalPrice || 0}
                         onChange={(e) => setOrderForm({ ...orderForm, finalPrice: parseInt(e.target.value) || 0 })}
                         className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary focus:outline-none px-3 py-2.5 rounded-xl text-xs font-semibold"
                         required
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Payment Status</label>
                       <select
                         value={orderForm.paymentStatus || "pending"}
                         onChange={(e) => setOrderForm({ ...orderForm, paymentStatus: e.target.value })}
                         className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary focus:outline-none px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700"
                       >
                         <option value="pending">Pending</option>
                         <option value="paid">Paid</option>
                         <option value="failed">Failed</option>
                       </select>
                     </div>
                   </div>
                 </div>

              </div>

              {/* Actions footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsConvertModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSaving ? "Converting..." : "Complete & Generate Order"}
                  <ArrowRight size={14} />
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
}
