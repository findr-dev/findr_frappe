import { useNavigate } from "react-router-dom";

function Card({ card }) {
   const navigate = useNavigate();
   const { id, image, title, description, place } = card;

   return (
      <div className="card w-full lg:w-2/6 rounded-2xl shadow-2xl p-8 lg:p-12 mt-12 cursor-pointer hover:translate-x hover:scale-105 transition ease-in-out duration-300">
         <div className="cardHeading">
            <div className="h-56">
               <img className="h-full object-contain" src={image} alt="asda" />
            </div>
         </div>
         <div className="cardBody">
            <div className="cardContent">
               <div className="cardTitle py-2">
                  <h2 className="text-2xl text-[#0f6990]">{title}</h2>
               </div>
               <p className="text-slate-500 py-2">{description}</p>
            </div>
            <div className="cardAction flex justify-center">
               <button
                  className="w-full text-white mt-2 py-2 shadow-lg rounded-xl bg-[#0f6990]"
                  onClick={() => navigate(`/${place}`)}
               >
                  Go to &gt;
               </button>
            </div>
         </div>
      </div>
   );
}

export default Card;
