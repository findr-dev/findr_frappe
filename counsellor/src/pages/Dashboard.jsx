// get studentList number

import Card from "../components/Card";
import cardImg1 from "../assets/cardImg1.png";
import cardImg2 from "../assets/cardImg2.png";
import {
   useFrappeGetDoc,
   useFrappeGetDocCount,
   useFrappeGetDocList,
} from "frappe-react-sdk";
import { useEffect, useState } from "react";

function Dashboard() {
   const [newlyPaid, setNewlyPaid] = useState({});
   const [newlyPaidLoading, setNewlyPaidLoading] = useState(true);
   const [existingStudent, setExistingStudent] = useState({});
   const [existingStudentLoading, setExistingStudentLoading] = useState(true);

   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      if (newlyPaidLoading == false && existingStudentLoading == false) {
         setIsLoading(false);
      }
   }, [newlyPaidLoading, existingStudentLoading]);

   const cards = [
      {
         id: "1",
         image: cardImg1,
         title: "Students List",
         description: `We have ${newlyPaid} new students`,
         place: "students/new",
      },
      {
         id: "2",
         image: cardImg2,
         title: "Attended Students",
         description: `You have attended ${existingStudent} new students`,
         place: "students",
      },
   ];

   return (
      <div className="container lg:px-24 px-4 py-24 h-dvh">
         <GetNewStudentsCount
            setNewlyPaid={setNewlyPaid}
            setNewlyPaidLoading={setNewlyPaidLoading}
         />
         <GetExisitngStudentsCount
            setExistingStudent={setExistingStudent}
            setExistingStudentLoading={setExistingStudentLoading}
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

const GetNewStudentsCount = ({ setNewlyPaid, setNewlyPaidLoading }) => {
   const { data, isLoading } = useFrappeGetDocCount("Student", [
      ["course_fee", "=", "1"],
   ]);
   setNewlyPaid(data);
   if (!isLoading) setNewlyPaidLoading(isLoading);

   return null;
};

const GetExisitngStudentsCount = ({
   setExistingStudent,
   setExistingStudentLoading,
}) => {
   // const { data, isLoading } = useFrappeGetDocCount("Student", [
   //    ["course_list", "!=", "1"],
   // ]);

   const { data, isLoading } = useFrappeGetDocCount("Student", [
      ["course_fee", "=", "1"],
   ]);
   console.log(data);

   // if (!isLoading) {
   //    const sada = data.filter((check) => check.length > 0);
   //    console.log(sada);
   // }

   setExistingStudent(data);
   if (!isLoading) setExistingStudentLoading(isLoading);

   return null;
};
