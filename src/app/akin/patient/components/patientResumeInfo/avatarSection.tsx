
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {  Image } from "lucide-react";

export function AvatarSection({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="w-max flex flex-col items-center">
      <Avatar className="size-[150px]">
        <AvatarImage className="object-cover" src={imageSrc} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <h2 className="flex gap-2 text-sm items-center text-akin-turquoise cursor-pointer">
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image size={14} />
        Trocar foto
      </h2>
    </div>
  );
}