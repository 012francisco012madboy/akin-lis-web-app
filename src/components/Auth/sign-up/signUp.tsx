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

export const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // nome_completo: "",
    // data_nascimento: "",
    // numero_identificacao: "",
    // id_sexo: "",
    tipo: "",
    // cargo: "",
    // contacto_telefonico: "",
    nome: "",
    email: "",
    senha: "",
    status: "ATIVO",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
              />
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
              />
            </div>
            {/* <div>
              <Label htmlFor="data_nascimento">Data de Nascimento</Label>
              <Input
                id="data_nascimento"
                name="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={handleInputChange}
              />
            </div> */}
            {/* <div>
              <Label htmlFor="numero_identificacao">Número de Identificação</Label>
              <Input
                id="numero_identificacao"
                name="numero_identificacao"
                type="text"
                value={formData.numero_identificacao}
                onChange={handleInputChange}
                placeholder="Digite o número de identificação"
              />
            </div> */}
            {/* <div>
              <Label htmlFor="id_sexo">Sexo</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, id_sexo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Masculino</SelectItem>
                  <SelectItem value="2">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            <div>
              <Label htmlFor="id_cargo">Cargo</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="TECNICO">Técnico</SelectItem> */}
                  <SelectItem value="CHEFE">Chefe de Laboratório</SelectItem>
                  <SelectItem value="RECEPCIONISTA">Recepcionista</SelectItem>
                </SelectContent>
              </Select>

            </div>
            {/* <div>
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                name="cargo"
                type="text"
                value={formData.cargo}
                onChange={handleInputChange}
                placeholder="Digite o cargo"
              />
            </div> */}
            {/* <div>
              <Label htmlFor="contacto_telefonico">Contato Telefônico</Label>
              <Input
                id="contacto_telefonico"
                name="contacto_telefonico"
                type="tel"
                value={formData.contacto_telefonico}
                onChange={handleInputChange}
                placeholder="Digite o número de telefone"
              />
            </div> */}
            {/* <div>
              <Label htmlFor="nome">Nome de Usuário</Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Digite o nome de usuário"
              />
            </div> */}

            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleInputChange}
                placeholder="Digite a senha"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
             {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};