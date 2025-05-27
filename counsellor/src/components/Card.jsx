import { useNavigate } from "react-router-dom";

function Card({ card }) {
   const navigate = useNavigate();
   const { id, image, title, description, location } = card;

   return (
      <div className="card w-full lg:w-[22%] rounded-2xl shadow-xl p-8 lg:p-8 mt-12 cursor-pointer hover:translate-x hover:scale-105 transition ease-in-out duration-300">
         <div className="cardHeading">
            <div className="h-20">{image}</div>
         </div>
         <div className="cardBody">
            <div className="cardContent">
               <div className="cardTitle py-2">
                  <h2 className="text-2xl text-center text-[#0f6990]">{title}</h2>
               </div>
               <p className="text-slate-500 py-2 min-h-16">{description}</p>
            </div>
            <div className="cardAction flex justify-center">
               <button
                  className="w-full text-white mt-2 py-2 shadow-lg rounded-xl bg-[#0f6990]"
                  onClick={() => navigate(`/${location}`)}
               >
                  Go to &gt;
               </button>
            </div>
         </div>
      </div>
   );
}

export default Card;
