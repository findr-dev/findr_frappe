import { createContext, useContext, useState, useEffect } from "react";
import { useFrappeAuth, useFrappeGetDoc } from "frappe-react-sdk";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
   const { currentUser } = useFrappeAuth();
   const { data } = useFrappeGetDoc("User", currentUser || "");
   const [roleProfile, setRoleProfile] = useState("");
   const [userName, setUserName] = useState("");

   useEffect(() => {
      if (data?.role_profile_name) {
         setRoleProfile(data.role_profile_name || "");
         setUserName(data.full_name || "");
      }
   }, [data]);

   return (
      <RoleContext.Provider value={{ currentUser, roleProfile, userName }}>
         {children}
      </RoleContext.Provider>
   );
};

export const useRole = () => useContext(RoleContext);
