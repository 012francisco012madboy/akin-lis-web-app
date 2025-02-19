// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Share2, Facebook, Twitter, Linkedin, Mail, MessageCircle } from "lucide-react";

// export default function ShareButton() {
//   const [url, setUrl] = useState(() => typeof window !== "undefined" ? window.location.href : "");

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline">
//           <Share2 className="mr-2 w-5 h-5" />
//           Partilhar
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank")}>
//           <Facebook className="mr-2 w-5 h-5 text-blue-600" /> Facebook
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => window.open(`https://twitter.com/intent/tweet?url=${url}`, "_blank")}>
//           <Twitter className="mr-2 w-5 h-5 text-sky-500" /> Twitter
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => window.open(`https://www.linkedin.com/shareArticle?url=${url}`, "_blank")}>
//           <Linkedin className="mr-2 w-5 h-5 text-blue-700" /> LinkedIn
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => window.open(`mailto:?subject=Veja isso!&body=${url}`, "_self")}>
//           <Mail className="mr-2 w-5 h-5 text-gray-500" /> Email
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => window.open(`https://wa.me/?text=${url}`, "_blank")}>
//           <MessageCircle className="mr-2 w-5 h-5 text-green-500" /> WhatsApp
//         </DropdownMenuItem>

//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }


"use client";

import { useState } from "react";

export default function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [url] = useState(() => (typeof window !== "undefined" ? window.location.href : ""));

  const shareOptions = [
    { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${url}`, color: "text-blue-600" },
    { name: "Twitter", url: `https://twitter.com/intent/tweet?url=${url}`, color: "text-sky-500" },
    { name: "LinkedIn", url: `https://www.linkedin.com/shareArticle?url=${url}`, color: "text-blue-700" },
    { name: "Email", url: `mailto:?subject=Veja isso!&body=${url}`, color: "text-gray-500" },
    { name: "WhatsApp", url: `https://wa.me/?text=${url}`, color: "text-green-500" },
  ];

  return (
    <div className="relative inline-block text-left">
      {/* Botão que abre o dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white shadow-md hover:bg-gray-100 focus:outline-none"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M12 4l8 8-8 8" />
        </svg>
        Partilhar
      </button>

      {/* Dropdown com visibilidade controlada pelo estado */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
          {shareOptions.map((option) => (
            <a
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center px-4 py-2 hover:bg-gray-100 ${option.color}`}
            >
              <span className="mr-2">•</span> {option.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
