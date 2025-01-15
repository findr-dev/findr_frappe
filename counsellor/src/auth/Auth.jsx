import { useFrappeAuth } from "frappe-react-sdk";
import { useState } from "react";

export const AuthComponent = () => {
   const {
      currentUser,
      isValidating,
      isLoading,
      login,
      logout,
      error,
      updateCurrentUser,
      getUserCookie,
   } = useFrappeAuth();

   const [formData, setFormData] = useState({});

   if (isLoading) return <div>loading...</div>;

   // render user
   return (
      <div className="h-screen flex flex-col justify-center items-center ">
         {currentUser} is the current user
         <input
            type="text"
            name="username"
            onChange={(e) =>
               setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            placeholder="User Name"
            className="border rounded-lg px-2 text-[#0f6990] focus:outline-none p-1"
         />
         <input
            type="text"
            name="password"
            placeholder="Password"
            onChange={(e) =>
               setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            className="border rounded-lg px-2 text-[#0f6990] focus:outline-none p-1"
         />
         <button onClick={() => login(formData.username, formData.password)}>
            Login
         </button>
         <button onClick={logout}>Logout</button>
         <button onClick={updateCurrentUser}>Fetch current user</button>
      </div>
   );
};
