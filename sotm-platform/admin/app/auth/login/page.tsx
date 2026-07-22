"use client";

import { API_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeClosed, Eye } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

type LoginFormValues = {
  email: string;
  password: string;
};

type ResetPasswordFormValues = {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const router = useRouter();

  const loginForm = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const resetForm = useForm<ResetPasswordFormValues>({
    defaultValues: {
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function togglePasswordVisibility(
    field: keyof typeof passwordVisibility
  ) {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field],
    });
  }

  async function handleLogin(data: LoginFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/auth/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email, password: data.password }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", responseData.access_token);
        toast.success("Login successful!");
        router.push("/admin");
      } else {
        toast.error(responseData.message || "Login failed", {
          description: responseData.error,
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed", {
        description: "An unexpected error occured. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetPassword(data: ResetPasswordFormValues) {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match", {
        description: "New password and confirmation must match.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        toast.success("Password reset successful", {
          description: "Please login with your new password.",
        });
        setIsResetMode(false);
        resetForm.reset();
        loginForm.reset();
      } else {
        toast.error(responseData.message || "Password reset failed");
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      toast.error("Password reset failed", {
        description: "An unexpected error occured. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function toggleResetMode() {
    setIsResetMode(!isResetMode);

    if (!isResetMode) {
      loginForm.setValue("email", loginForm.getValues("email"));
    } else {
      loginForm.setValue("email", resetForm.getValues("email"));
    }
  }

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);
  // const handleShowPassword = () => {
  //   setShowPassword(!showPassword);
  // };
  // const handleLogin = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(
  //       // `${API_URL}/auth/signin`,
  //       `${API_URL}/auth/signin`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ email, password }),
  //       }
  //     );

  //     const data = await response.json();

  //     if (response.ok) {
  //       console.log(data);
  //       localStorage.setItem("access_token", data.access_token);
  //       toast.success("Login successful");
  //       router.push("/admin");
  //     } else {
  //       toast.error(data.message || "Login failed", {
  //         description: data.error,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //     toast.error("Login failed", {
  //       description: "An unexpected error occurred. Please try again.",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // return (
  //   <div className="flex flex-col items-center justify-center min-h-screen p-4">
  //     <h1 className="text-3xl font-bold mb-4">
  //       {isResetMode ? "Reset Password" : "Login"}
  //     </h1>
  //     {/* <div className="w-full max-w-sm">
  //       <div className="space-y-4">
  //         <Label htmlFor="email">Email</Label>
  //         <Input
  //           id="email"
  //           type="email"
  //           value={email}
  //           onChange={(e) => setEmail(e.target.value)}
  //         />
  //       </div>
  //       <div className="space-y-4 mt-4">
  //         <Label htmlFor="password">Password</Label>
  //         <div className="relative">
  //           <Input
  //             id="password"
  //             type={showPassword ? "text" : "password"}
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //             className="pr-10"
  //           />
  //           <button
  //             type="button"
  //             onClick={handleShowPassword}
  //             className="absolute right-3 top-1/2 transform -translate-y-1/2"
  //             aria-label={showPassword ? "Hide password" : "Show password"}
  //           >
  //             {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
  //           </button>
  //         </div>
  //       </div>
  //       <Button
  //         onClick={handleLogin}
  //         disabled={isLoading}
  //         className="mt-4 w-full"
  //       >
  //         {isLoading ? "Logging in..." : "Login"}
  //       </Button>
  //     </div> */}
  //   </div>
  // );
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">
        {isResetMode ? "Reset Password" : "Login"}
      </h1>
      <div className="w-full max-w-sm">
        {isResetMode ? (
          <form
            onSubmit={resetForm.handleSubmit(handleResetPassword)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                {...resetForm.register("email", {
                  required: "Email is required",
                })}
              />
              {resetForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {resetForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={
                    passwordVisibility.currentPassword ? "text" : "password"
                  }
                  {...resetForm.register("currentPassword", {
                    required: "Current password is required",
                  })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("currentPassword")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  aria-label={
                    passwordVisibility.currentPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {passwordVisibility.currentPassword ? (
                    <EyeClosed size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {resetForm.formState.errors.currentPassword && (
                <p className="text-sm text-destructive">
                  {resetForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={passwordVisibility.newPassword ? "text" : "password"}
                  {...resetForm.register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  aria-label={
                    passwordVisibility.newPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {passwordVisibility.newPassword ? (
                    <EyeClosed size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {resetForm.formState.errors.newPassword && (
                <p className="text-sm text-destructive">
                  {resetForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={
                    passwordVisibility.confirmPassword ? "text" : "password"
                  }
                  {...resetForm.register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === resetForm.getValues("newPassword") ||
                      "Passwords do not match",
                  })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  aria-label={
                    passwordVisibility.confirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {passwordVisibility.confirmPassword ? (
                    <EyeClosed size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {resetForm.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {resetForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="mt-4 w-full">
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={loginForm.handleSubmit(handleLogin)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                {...loginForm.register("email", {
                  required: "Email is required",
                })}
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={passwordVisibility.password ? "text" : "password"}
                  {...loginForm.register("password", {
                    required: "Password is required",
                  })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  aria-label={
                    passwordVisibility.password
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {passwordVisibility.password ? (
                    <EyeClosed size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="mt-4 w-full">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        )}

        <Button
          variant="link"
          onClick={toggleResetMode}
          className="mt-2 w-full"
        >
          {isResetMode ? "Back to Login" : "Reset Password"}
        </Button>
      </div>
    </div>
  );
}
