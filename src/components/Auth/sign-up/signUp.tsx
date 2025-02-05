"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APP_CONFIG } from "@/config/app";
import { useState } from "react";
import { _axios } from "@/lib/axios";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import { Eye, EyeOff } from "lucide-react";

export const Register = () => {
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "",
    nRef: "",
    nome: "",
    email: "",
    senha: "",
    status: "ATIVO",
  });
  const [errors, setErrors] = useState({
    tipo: "",
    nRef: "",
    nome: "",
    email: "",
    senha: "",
  });

  const validate = () => {
    let tempErrors = { tipo: "", nRef: "", nome: "", email: "", senha: "" };
    if (!formData.nome) tempErrors.nome = "Nome é obrigatório.";
    if (!formData.email) tempErrors.email = "Email é obrigatório.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email inválido.";
    if (!formData.senha) tempErrors.senha = "Senha é obrigatória.";
    if (formData.senha.length < 6) tempErrors.senha = "Senha deve ter pelo menos 6 caracteres.";
    if (!formData.tipo) tempErrors.tipo = "Cargo é obrigatório.";
    if (!formData.nRef) tempErrors.nRef = "Referência é obrigatória.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await _axios.post("auth/local/signup", formData);
      if (response.status === 201) {
        ___showSuccessToastNotification({ message: "Usuário cadastrado com sucesso" });
      }
      window.location.href = "/";
    } catch (error) {
      ___showErrorToastNotification({ message: "Erro ao enviar dados do formulário" });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-5">
      <Image src={APP_CONFIG.LOGO} alt="Akin logo" />
      <Card className="w-full max-w-md shadow-lg rounded-md bg-white">
        {/* Header */}
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-gray-800">
            Cadastro de Usuário
          </CardTitle>
          <p className="text-center text-sm text-gray-500">
            Preencha as informações para criar uma conta
          </p>
        </CardHeader>

        {/* Form Content */}
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Digite o nome completo"
                disabled={isLoading}
              />
              {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Digite o email"
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="id_cargo">Cargo</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value="TECNICO">Técnico</SelectItem>
                  <SelectItem value="CHEFE" disabled={isLoading}>Chefe de Laboratório</SelectItem>
                  <SelectItem value="RECEPCIONISTA" disabled={isLoading} >Recepcionista</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo && <p className="text-red-500 text-sm">{errors.tipo}</p>}
            </div>
            <div>
              <Label htmlFor="email">Referência da unidade de saúde</Label>
              <Input
                id="nRef"
                name="nRef"
                type="text"
                value={formData.nRef}
                onChange={handleInputChange}
                placeholder="Código de referência "
                disabled={isLoading}
              />
              {errors.nRef && <p className="text-red-500 text-sm">{errors.nRef}</p>}
            </div>
            <div className="relative">
              <Label htmlFor="senha" className="text-gray-700">
                Senha
              </Label>
              <Input
                id="senha"
                name="senha"
                type={showPassword ? "text" : "password"}
                value={formData.senha}
                onChange={handleInputChange}
                placeholder="Digite sua senha"
                aria-label="Digite sua senha"
                className="mt-2"
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
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};