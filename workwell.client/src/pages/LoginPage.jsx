import { useState, useEffect } from "react"
import { useLogin } from "../hooks/useLogin"
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../hooks/useAuthContext.js"


const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useLogin();
    const { user } = useAuthContext();
    const navigate = useNavigate();

    //useEffect(() => {
    //    // Redirect if user is logged in and has role 0
    //    if (user && user.role === 0) {
    //        navigate('/dashboard');
    //    }
    //}, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await login(email, password)
            console.log("Log successful")
            navigate("/dashboard")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-primary-blue">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto my-20">
                <h2 className="text-2xl font-medium mb-6 text-center">Welcome Back!</h2>
                <form onSubmit={handleSubmit}>
                    
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
                            Log in
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

export default LoginPage