import { useNavigate } from "react-router-dom";
import findr_logo from "../assets/logo3.png";
import { useFrappeAuth } from "frappe-react-sdk";

function Navbar() {
   const navigate = useNavigate();
   const { logout } = useFrappeAuth();
   return (
      <div className="px-8 py-3 backdrop-blur fixed w-full">
         <div className="flex justify-between">
            <button onClick={() => navigate("/")}>
               <img src={findr_logo} alt="Findr Logo" className="h-14" />
            </button>
            <button
               className="text-lg shadow py-2 px-4 rounded-2xl hover:scale-90 bg-[#0f6990] text-white transition ease-in-out duration-300"
               onClick={logout}
            >
               Logout
            </button>
         </div>
      </div>
   );
}

export default Navbar;
