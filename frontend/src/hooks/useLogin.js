import { useState } from "react";
import toast from "react-hot-toast";

const useLogin = () => {
    const[loading, setLoading] = useState(false);
    const login = async ({userName, password}) =>{
      const success = handleInputErrors({userName, password})
      if(!success) return;
    
      setLoading(true)
      try {
          const res = await fetch("/api/auth/login",{
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({userName, password}),
          });
          if(!res.ok){
              throw new Error(data.message || "Failed to login");
          }
        
          const data = await res.json()
          console.log(data);
          toast.success('You have logged in successfully.')
      } catch (error) {
          toast.error(error.message)
      }finally{
          setLoading(false)
      }
    };
    return {loading, login};
};

export default useLogin

function handleInputErrors({userName, password}){
    if(!userName || !password){
        toast.error('Please fill in all the fields')
        return false;
    }
    return true
}