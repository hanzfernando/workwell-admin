import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../hooks/useAuthContext.js";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useLogin();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    // Handle login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset any previous error messages

        try {
            // Try logging in
            await login(email, password);
            //console.log("Login successful");
            //window.reload();
            //// Check if the user is an admin
            //if (user?.role === "Admin") {
            //    navigate('/users');
            //} else if (user?.role === "SuperAdmin") {
            //    navigate('/admins');
            //} else if (user?.role !== "Admin" || (user?.role !== "SuperAdmin")) {
            //    // If user is not an admin (role is not 0), show error message
            //    throw new Error('Unauthorized access: User role not permitted');
            //}
        } catch (error) {
            //console.error(error);

            // Handle specific error message
            if (error.message === 'Unauthorized access: User role not permitted') {
                setError('Only admin accounts can log in.');
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            // Clear fields after login attempt, regardless of success or failure
            setEmail('');
            setPassword('');
        }
    };

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

                    {/* Display error message if there's an error */}
                    {error && (
                        <div className="mt-4 text-red-500 text-center">
                            <p>{error}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
