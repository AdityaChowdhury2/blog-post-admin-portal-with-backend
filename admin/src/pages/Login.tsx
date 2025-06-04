import { useState, useEffect } from "react";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import logo from "../assets/images/logo-dark.png";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { clearError } from "../redux/features/authSlice";
import { useLoginMutation } from "../redux/api/authApiSlice";
import { Input } from "../components/ui/input";
import { useForm } from "react-hook-form";

// Define form data type
interface FormData {
    email: string;
    password: string;
}

export default function Login() {
    const dispatch = useAppDispatch();
    const { error, isAuthenticated } = useAppSelector((state) => state.auth);
    const [login, { isLoading }] = useLoginMutation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        defaultValues: {
            email: "",
            password: ""
        }
    });

    useEffect(() => {
        // Redirect if already authenticated
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    // If there's an error from Redux, clear it when form changes
    useEffect(() => {
        if (error) {
            return () => { dispatch(clearError()); };
        }
    }, [error, dispatch]);

    const onSubmit = async (data: FormData) => {
        try {

            console.log(data);

            await login({
                email: data.email,
                password: data.password,
            }).unwrap();
            // No need to navigate here as the auth slice will update isAuthenticated
            // and the useEffect will handle the navigation
        } catch (err) {
            // Error handling is now done in the auth slice
            console.error("Login error:", err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-200 p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <img src={logo} alt="Logo" className="h-12 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-blue-800">Welcome back</h1>
                    <p className="text-gray-600 mt-2">Enter your credentials to access your account</p>
                </div>

                <div className="bg-gray-200 shadow-md rounded-lg p-8">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 h-10 left-0 pl-3 flex items-center pointer-events-none ">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type="email"
                                        id="email"
                                        className="pl-10"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                    />
                                    {errors.email && (
                                        <span className="text-sm text-red-500 mt-1">
                                            {errors.email.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 h-10 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        className="pl-10"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters"
                                            }
                                        })}
                                    />
                                    <div
                                        className="absolute inset-y-0 h-10 right-0 pr-3 flex items-center hover:cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword
                                            ? <EyeOff className="h-5 w-5 text-gray-400" />
                                            : <Eye className="h-5 w-5 text-gray-400" />}
                                    </div>
                                    {errors.password && (
                                        <span className="text-sm text-red-500 mt-1">
                                            {errors.password.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                {/* Remember me and forgot password sections removed */}
                            </div>

                            <Button
                                type="submit"
                                className="w-full flex cursor-pointer justify-center items-center bg-[#000] text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="animate-pulse">Signing in...</span>
                                ) : (
                                    <>
                                        <LogIn className="mr-2 h-4 w-4" /> Sign in
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Sign up section removed */}
            </div>
        </div>
    );
} 