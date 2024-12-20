import { useNavigate } from "react-router-dom";
import findr_logo from "../assets/logo3.png";

function Navbar() {
   const navigate = useNavigate();
   return (
      <div className="px-8 py-3 h-18 backdrop-blur fixed w-full">
         <div className="h-14">
            <button className="h-14" onClick={() => navigate("/")}>
               <img src={findr_logo} alt="Findr Logo" className="h-full" />
            </button>
         </div>
      </div>
   );
}

export default Navbar;
