import { useState } from "react"
import toast from "react-hot-toast";

const useSignup = () => {
    const[loading, setLoading] = useState(false);
    const signup = async ({fullName, userName, password, confirmPassword, gender}) =>{
        const success = handleInputErrors({fullName, userName, password, confirmPassword, gender})
        if(!success) return;

        setLoading(true)
        try {
            const res = await fetch("/api/auth/signup",{
                method: "POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({fullName, userName, password, confirmPassword, gender}),
            });
            if (!res.ok) {
                throw new Error(data.message || "Failed to sign up");
            }            

            const data = await res.json()
            console.log(data);
            toast.success('You have signed up successfully.')
        } catch (error) {
            toast.error(error.message)
        }finally{
            setLoading(false);
        }
    };

    return {loading, signup};
};

export default useSignup

function handleInputErrors({fullName, userName, password, confirmPassword, gender}){
    if(!fullName || !userName || !password || !confirmPassword || !gender){
        toast.error('Please fill in all the fields')
        return false
    }
    if (password !== confirmPassword){
        toast.error('Passwords do not match')
        return false
    }
    if(password.length < 8){
        toast.error('Password must be at least 8 characters')
    }
    return true
}