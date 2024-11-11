import GenderCheckbox from "./GenderCheckbox"

const SignUp = () => {
  return (
    <div className="flex flex-col items-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0">
      <h1 className="text-3xl font-semibold text-center text-gray-300">Sign Up
          <span className="text-blue-300"> Pulse</span>
        </h1>

        <form>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Full Name</span>
            </label>
            <input type="text" placeholder="John Doe" className="w-full input input-bordered h-10" />
          </div>

          <div>
          <label className="label p-2">
              <span className="text-base label-text">Username</span>
            </label>
            <input type="text" placeholder="johndoe" className="w-full input input-bordered h-10" />
          </div>

          <div>
          <label className="label">
              <span className="text-base label-text">Password</span>
            </label>
            <input type="password" placeholder="Enter Password" className="w-full input input-bordered h-10" />
          </div>

          <div>
            <label className="label">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <input type="password" placeholder="Confirm Password" className="w-full input input-bordered h-10" />
          </div>

          <GenderCheckbox />

          <a href="#" className="text-sm text-white hover:underline hover:text-blue-500 mt-2 inline-block">
            Already have an account?
          </a>

          <div>
            <button className="btn btn-block hover:bg-blue-500 btn-sm mt-2 text-lg font-semibold hover:text-black">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp
