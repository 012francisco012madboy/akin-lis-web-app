"use client"

import { APP_CONFIG } from "@/config/app"
import Image from "next/image"
import { View } from "../view"
import { Input } from "../input"
import Link from "next/link"
import { Button } from "../button"

export const Login = () => {
  return (
    <aside className="space-y-14 p-[10%] md:col-span-1 flex flex-col justify-center relative">
      <Image
        className="absolute top-[11%] left-[10%] w-[11rem]"
        src={APP_CONFIG.LOGO}
        alt="Akin logo"
      />
      <View.Vertical className="space-y-2">
        <View.Vertical>
          <strong className="text-akin-turquoise">Email:</strong>
          <Input.InputText
            type="email"
            placeholder="Digite o seu e-mail"
            aria-label="Digite seu e-mail"
          />
        </View.Vertical>
        <View.Vertical>
          <strong className="text-akin-turquoise">Password:</strong>
          <Input.InputText
            type="password"
            placeholder="Digite a sua password"
            aria-label="Digite sua senha"
          />
        </View.Vertical>
        <View.Horizontal className="justify-between items-center">
          <p>Relembrar-me</p>
          <Input.Switch />
        </View.Horizontal>
        <View.Horizontal className="justify-end pt-4">
          <Link href="/auth">
            <Button.Primary label="Entrar" />
          </Link>
        </View.Horizontal>
      </View.Vertical>
    </aside>

  )
}