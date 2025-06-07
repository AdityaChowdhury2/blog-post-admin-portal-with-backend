import { useState, useEffect } from "react";

import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { clearError } from "../redux/features/authSlice";
import { useRegisterMutation } from "../redux/api/authApiSlice";
import { Input } from "../components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { Label } from "../components/ui/label";
import { FaRegUser } from "react-icons/fa";
import { LiaUserTagSolid } from "react-icons/lia";

import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { UserRole } from "../constants/user.constant";
import { LuEyeOff, LuLock, LuMail } from "react-icons/lu";
import { AiOutlineUserAdd } from "react-icons/ai";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

// Define form data type
interface FormData {
  email: string;
  password: string;
  name: string;
  role: (typeof UserRole)[number];
}

export default function Register() {
  const dispatch = useAppDispatch();
  const { error, isAuthenticated } = useAppSelector((state) => state.auth);
  const [registerUser, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
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
      return () => {
        dispatch(clearError());
      };
    }
  }, [error, dispatch]);

  const onSubmit = async (data: FormData) => {
    try {
      console.log(data);

      await registerUser({
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      }).unwrap();

      toast.success("User registered successfully");
      navigate("/login");
    } catch (err) {
      // Error handling is now done in the auth slice
      console.error("Login error:", err);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register | Blog App</title>
      </Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-200 p-4">
        <Card className="w-full max-w-md bg-gray-200">
          <CardHeader className="flex flex-col items-center justify-center">
            <CardTitle className="text-2xl font-bold text-blue-800 text-center mb-2">
              Welcome to the Register Page
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className=" bg-gray-200 p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 h-10 left-0 pl-3 flex items-center pointer-events-none ">
                      <FaRegUser className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      id="name"
                      className="pl-10"
                      {...register("name", {
                        required: "Name is required",
                      })}
                    />
                    {errors.name && (
                      <span className="text-sm text-red-500 mt-1">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 h-10 left-0 pl-3 flex items-center pointer-events-none ">
                      <LiaUserTagSolid className="h-5 w-5 text-gray-400" />
                    </div>
                    <Controller
                      name="role"
                      control={control} // from useForm()
                      rules={{ required: "Role is required" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            {UserRole.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.role && (
                      <span className="text-sm text-red-500 mt-1">
                        {errors.role.message}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 h-10 left-0 pl-3 flex items-center pointer-events-none ">
                      <LuMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="email"
                      id="email"
                      className="pl-10"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
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
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 h-10 left-0 pl-3 flex items-center pointer-events-none">
                      <LuLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="pl-10"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    <div
                      className="absolute inset-y-0 h-10 right-0 pr-3 flex items-center hover:cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <LuEyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <LuEyeOff className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    {errors.password && (
                      <span className="text-sm text-red-500 mt-1">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full flex cursor-pointer justify-center items-center bg-[#000] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-pulse">Signing up...</span>
                ) : (
                  <>
                    <AiOutlineUserAdd className="mr-2 h-4 w-4" /> Sign Up
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
