"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"
import Link from "next/link"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { APP_CONFIG } from "@/config/app"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { _axios } from "@/lib/axios"
import { useAuthStore } from "@/utils/zustand-store/authStore"

type User = {
  id: string;
  access_token: string;
  refresh_token: string;
}

export const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter();

  useEffect(() => {
    if (user != null) return router.push('/akin/dashboard')
  }, [isAuthenticated, router, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await _axios.post<User>('/auth/local/signin', { email, senha });
      const { access_token } = response.data;
      login(access_token, response.data);
      router.push('/akin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao autenticar');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-5">
      <Image
        className=""
        src={APP_CONFIG.LOGO}
        alt="Akin logo"
      />
      <Card className="w-full max-w-md shadow-lg rounded-md bg-white">
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
              />
            </div>

            {/* Password Input */}
            <div>
              <Label htmlFor="password" className="text-gray-700">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={senha}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                aria-label="Digite sua senha"
                className="mt-2"
              />
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
                href="/forgot-password"
                className="text-sm text-blue-500 hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Entrar
            </Button>
          </form>
        </CardContent>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 mt-4">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Registre-se
          </Link>
        </div>
      </Card>
    </div>
  );
}