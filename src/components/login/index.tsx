
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { APP_CONFIG } from "@/config/app";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import _axios from "@/Api/axios.config";
import { useAuthStore } from "@/utils/zustand-store/authStore";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import { validateEmail, validatePassword } from "./validation/login-validation";
import { Eye, EyeOff } from "lucide-react";
import { UserData } from "@/app/akin/profile/page";
import Cookies from "js-cookie";
import { authRoutes } from "@/Api/Routes/Auth";
import { userRoutes } from "@/Api/Routes/User";


export const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async () => { return await authRoutes.login(email, senha) },
    onSuccess: async (data) => {
      const user = await userRoutes.getUser(data.id);
      Cookies.set('akin-role', user.tipo, { secure: true, sameSite: 'Strict' });
      ___showSuccessToastNotification({ message: "Autenticação realizada!" });
      login(data.access_token, data);
      router.push("/akin/dashboard");
    },
    onError: () => {
      ___showErrorToastNotification({
        message: "Erro ao autenticar",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!validateEmail(email)) {
      setEmailError("Email inválido");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!validatePassword(senha)) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (!hasError) {
      loginMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 gap-5">
      <Image src={APP_CONFIG.LOGO} alt="Akin logo" />
      <Card className="w-full max-w-lg pb-3 shadow-lg rounded-md bg-white">
        {/* Header */}
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-gray-800">
            Bem-vindo de volta
          </CardTitle>
          <p className="text-center text-sm text-gray-500">
            Entre com sua conta para continuar
          </p>
        </CardHeader>

        {/* Form Content */}
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                aria-label="Digite seu e-mail"
                className="mt-2"
                disabled={loginMutation.isPending}
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            {/* Password Input */}
            <div className="relative">
              <Label htmlFor="password" className="text-gray-700">
                Senha
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                aria-label="Digite sua senha"
                className="mt-2"
                disabled={loginMutation.isPending}
              />
              <button
                type="button"
                className="absolute right-4 top-[52px] transform text-gray-500 -translate-y-1/2"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember-me" />
                <Label htmlFor="remember-me" className="text-gray-600 text-sm">
                  Relembrar-me
                </Label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-500 hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 mt-4">
          Não tem uma conta?{" "}
          <Link href="/auth/signup" className="text-blue-500 hover:underline">
            Registre-se
          </Link>
        </div>
      </Card>
    </div>
  );
};