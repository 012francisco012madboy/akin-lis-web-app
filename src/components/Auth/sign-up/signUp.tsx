"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APP_CONFIG } from "@/config/app";
import { useState } from "react";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import { Eye, EyeOff } from "lucide-react";
import { authRoutes } from "@/Api/Routes/Auth";
import Link from "next/link";

export const Register = () => {
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "",
    id_unidade_saude: "",
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    status: "ATIVO",
    contacto_telefonico: "", 
  });
  const [errors, setErrors] = useState({
    tipo: "",
    id_unidade_saude: "",
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    contacto_telefonico: "",
  });

  const validate = () => {
    let tempErrors = { tipo: "", id_unidade_saude: "", nome: "", email: "", senha: "", confirmarSenha: "", contacto_telefonico: "" };
    if (!formData.nome) tempErrors.nome = "Nome é obrigatório."; 
    if (!formData.email) tempErrors.email = "Email é obrigatório.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email inválido.";
    if (!formData.senha) tempErrors.senha = "Senha é obrigatória.";
  if (!formData.confirmarSenha) tempErrors.confirmarSenha = "Confirme sua senha.";
    if (formData.senha.length < 6) tempErrors.senha = "Senha deve ter pelo menos 6 caracteres.";
    if (!formData.tipo) tempErrors.tipo = "Cargo é obrigatório.";
    if (!formData.id_unidade_saude) tempErrors.id_unidade_saude = "Referência é obrigatória.";
    if (!formData.contacto_telefonico) tempErrors.contacto_telefonico = "Telefone é obrigatório.";
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
      const response = await authRoutes.register(formData);
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
    <div className="min-h-screen flex flex-col w-full items-center justify-center p-6 gap-5">
      <Image src={APP_CONFIG.LOGO} alt="Akin logo" />
      <Card className="w-full max-w-lg shadow-lg rounded-md bg-white">
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
              <Label htmlFor="contacto_telefonico">Telefone</Label>
              <Input
                id="contacto_telefonico"
                name="contacto_telefonico"
                type="tel"
                value={formData.contacto_telefonico}
                onChange={handleInputChange}
                placeholder="Digite o telefone"
                disabled={isLoading}
              />
              {errors.contacto_telefonico && <p className="text-red-500 text-sm">{errors.contacto_telefonico}</p>}
            </div>
            {/*
            
            <div>
              <Label htmlFor="id_sexo">Genero</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, id_sexo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o genero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"1"} disabled={isLoading}>Masculino</SelectItem>
                  <SelectItem value={"2"} disabled={isLoading}>Feminino</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo && <p className="text-red-500 text-sm">{errors.id_sexo}</p>}
            </div>*/}
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
                id="id_unidade_saude"
                name="id_unidade_saude"
                type="text"
                value={formData.id_unidade_saude}
                onChange={handleInputChange}
                placeholder="Código de referência "
                disabled={isLoading}
              />
              {errors.id_unidade_saude && <p className="text-red-500 text-sm">{errors.id_unidade_saude}</p>}
            </div>
            <div className="relative">
              <Label htmlFor="senha">
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
            <div>
              <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
              <Input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                value={formData.confirmarSenha}
                onChange={handleInputChange}
                placeholder="Confirme sua senha"
                disabled={isLoading}
              />
              {errors.confirmarSenha && <p className="text-red-500 text-sm">{errors.confirmarSenha}</p>}
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 mt-4">
            Já possui uma conta?{" "}
            <Link href="/" className="text-blue-500 hover:underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};