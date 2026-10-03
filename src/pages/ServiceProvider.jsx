import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ServiceProvider() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/booking.php", { 
      state: location.state, 
      replace: true 
    });
  }, [location, navigate]);

  return (
    <div className="py-24 flex items-center justify-center bg-slate-50 min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[#BC0202] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-slate-500">Redirecting to Gas Booking...</span>
      </div>
    </div>
  );
}
