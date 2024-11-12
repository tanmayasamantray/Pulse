import { Link } from "react-router-dom"
import GenderCheckbox from "./GenderCheckbox"
import { useState } from "react"
import useSignup from "../../hooks/useSignup"

const SignUp = () => {

  const [inputs,setinputs] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: ''
  })

  const {loading, signup} = useSignup();
  const handleCheckboxChange = (gender) =>{
    setinputs({...inputs,gender});
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();
    await signup(inputs);
  }

  return (
    <div className="flex flex-col items-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0">
      <h1 className="text-3xl font-semibold text-center text-gray-300">Sign Up
          <span className="text-blue-300"> Pulse</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Full Name</span>
            </label>
            <input type="text" placeholder="John Doe" className="w-full input input-bordered h-10"
            value={inputs.fullName} onChange={(e) => setinputs({...inputs, fullName: e.target.value})} />
          </div>

          <div>
          <label className="label p-2">
              <span className="text-base label-text">Username</span>
            </label>
            <input type="text" placeholder="johndoe" className="w-full input input-bordered h-10"
            value={inputs.username} onChange={(e) => setinputs({...inputs, username: e.target.value})} />
          </div>

          <div>
          <label className="label">
              <span className="text-base label-text">Password</span>
            </label>
            <input type="password" placeholder="Enter Password" className="w-full input input-bordered h-10"
            value={inputs.password} onChange={(e) => setinputs({...inputs, password: e.target.value})} />
          </div>

          <div>
            <label className="label">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <input type="password" placeholder="Confirm Password" className="w-full input input-bordered h-10"
            value={inputs.confirmPassword} onChange={(e) => setinputs({...inputs, confirmPassword: e.target.value})} />
          </div>

          <GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />

          <Link to='/login' className="text-sm text-white hover:underline hover:text-blue-500 mt-2 inline-block">
            Already have an account?
          </Link>

          <div>
            <button className="btn btn-block hover:bg-blue-500 btn-sm mt-2 text-lg font-semibold hover:text-black" disabled={loading}>
            {loading ? <span className='loading loading-spinner'></span> : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp
