import Card from "../components/Card";
import { useFrappeGetDocCount } from "frappe-react-sdk";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function Dashboard({ token, setToken }) {
   const [newlyPaid, setNewlyPaid] = useState({});
   const [existingStudent, setExistingStudent] = useState({});
   const [isLoading, setIsLoading] = useState(true);
   const authLink =
      "https://findrstudy.frappe.cloud/api/method/frappe.integrations.oauth2.authorize?client_id=mmcsk8kp8q&response_type=code&redirect_uri=https://findrstudy.frappe.cloud/counsellor";

   const access_token = localStorage.getItem("access_token");
   const currentTime = new Date().getTime();
   const expiryTime = localStorage.getItem("expires_in");
   const refresh_token = localStorage.getItem("refresh_token");

   useEffect(() => {
      if (currentTime > expiryTime) {
         localStorage.removeItem("access_token");
         getAccessToken();
      }
   }, [expiryTime]);

   const [searchParams] = useSearchParams();

   const getAccessToken = async () => {
      if (refresh_token) {
         try {
            await axios
               .post(
                  "https://findrstudy.frappe.cloud/api/method/frappe.integrations.oauth2.get_token",
                  {
                     grant_type: "refresh_token",
                     code: refresh_token,
                     client_id: "mmcsk8kp8q",
                     redirect_uri: "https://findrstudy.frappe.cloud/counsellor",
                  },
                  {
                     headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                     },
                  }
               )
               .then((res) => {
                  if (res.status === 200) {
                     const expiryTime =
                        new Date().getTime() + res.data.expires_in;

                     localStorage.setItem("expires_in", expiryTime);
                     setToken(res.data.access_token);
                     localStorage.setItem(
                        "access_token",
                        res.data.access_token
                     );
                     localStorage.setItem(
                        "refresh_token",
                        res.data.refresh_token
                     );
                  }
               })
               .catch((err) => console.error(err));
         } catch (err) {
            console.error(err);
         }
      } else if (access_token) {
         setToken(access_token);
      } else {
         try {
            await axios
               .post(
                  "https://findrstudy.frappe.cloud/api/method/frappe.integrations.oauth2.get_token",
                  {
                     grant_type: "authorization_code",
                     code: searchParams.get("code"),
                     client_id: "mmcsk8kp8q",
                     redirect_uri: "https://findrstudy.frappe.cloud/counsellor",
                  },
                  {
                     headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                     },
                  }
               )
               .then((res) => {
                  if (res.status === 200) {
                     const expiryTime =
                        new Date().getTime() + res.data.expires_in;

                     localStorage.setItem("expires_in", expiryTime);
                     setToken(res.data.access_token);
                     localStorage.setItem(
                        "access_token",
                        res.data.access_token
                     );
                     localStorage.setItem(
                        "refresh_token",
                        res.data.refresh_token
                     );
                  }
               })
               .catch((err) => console.error(err));
         } catch (err) {
            console.error(err);
         }
      }
   };

   useEffect(() => {
      getAccessToken();
   }, []);

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
         {token ? (
            <>
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
            </>
         ) : (
            <div className="h-full flex justify-center items-center">
               <button
                  className="text-white mt-2 px-5 py-2 shadow-lg rounded-xl bg-[#0f6990]"
                  onClick={() => (location.href = authLink)}
               >
                  Login
               </button>
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
