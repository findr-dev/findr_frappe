import Card from "../components/Card";
import { useFrappeGetDocCount } from "frappe-react-sdk";
import {  useState } from "react";

function Dashboard() {
   const [newlyPaid, setNewlyPaid] = useState({});
   const [existingStudent, setExistingStudent] = useState({});
   const [isLoading, setIsLoading] = useState(true);

   const cards = [
      {
         id: "1",
         image: (
            <span className="material-symbols-outlined text-green-800 text-9xl text-center flex h-full justify-center align-middle">
               group_add
            </span>
         ),
         title: "Students List",
         description: `We have ${newlyPaid} new students`,
         location: "students/new",
      },
      {
         id: "2",
         image: (
            <span className="material-symbols-outlined text-green-800 text-9xl text-center flex h-full justify-center align-middle">
               partner_exchange
            </span>
         ),
         title: "Attended Students",
         description: `You have given courses to ${existingStudent} students`,
         location: "students",
      },
   ];

   return (
      <div className="container lg:px-24 px-4 py-24 h-dvh">
         <GetNewStudentsCount
            setNewlyPaid={setNewlyPaid}
            setIsLoading={setIsLoading}
         />
         <GetExisitngStudentsCount
            setExistingStudent={setExistingStudent}
            setIsLoading={setIsLoading}
         />
         <div className="title">
            <p className="text-4xl lg:text-5xl  text-[#0f6990]">
               Welcome back Counsellor
            </p>
         </div>
         {isLoading ? (
            <div className="h-dvh flex justify-center align-middle">
               <div className="loader"></div>
            </div>
         ) : (
            <div className="cardLayout flex flex-wrap justify-evenly align-middle gap-8">
               {/* students list */}
               {cards.map((card) => (
                  <Card key={card.id} card={card} />
               ))}
            </div>
         )}
      </div>
   );
}

export default Dashboard;

const GetNewStudentsCount = ({ setNewlyPaid, setIsLoading }) => {
   const { data, isLoading } = useFrappeGetDocCount("Student", [
      ["registration_fee", "=", "1"],
      ["course_added", "=", "0"],
   ]);

   if (isLoading) setIsLoading(isLoading);
   else {
      setIsLoading(isLoading);
      setNewlyPaid(data);
   }

   return null;
};

const GetExisitngStudentsCount = ({ setExistingStudent, setIsLoading }) => {
   const { data, isLoading } = useFrappeGetDocCount("Student", [
      ["registration_fee", "=", "1"],
      ["course_added", "=", "1"],
   ]);

   if (isLoading) setIsLoading(isLoading);
   else {
      setIsLoading(isLoading);
      setExistingStudent(data);
   }

   return null;
};
