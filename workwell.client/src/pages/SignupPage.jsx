import { useState } from "react"
import { useSignup } from "../hooks/useSignup"  // Assuming you have a custom hook for signup
import { useNavigate } from "react-router-dom"

const SignupPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const { signup } = useSignup()
    //const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await signup(firstName, lastName, email, password)
            //console.log("Signup successful")
            //navigate("/login") // Redirect to login page after successful signup
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-primary-blue">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto my-20">
                <h2 className="text-2xl font-medium mb-6 text-center">Create an Account</h2>
                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="firstname">First Name</label>
                        <input
                            type="text"
                            id="firstname"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="lastname">Last Name</label>
                        <input
                            type="text"
                            id="lastname"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-accent-aqua w-full hover:bg-blue-700 text-white font-bold py-2 px-8 mt-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="flex flex-col items-center justify-between">
                        {/* {error && <p className="text-red-500 text-xs italic ">{error}</p>} */}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignupPage
