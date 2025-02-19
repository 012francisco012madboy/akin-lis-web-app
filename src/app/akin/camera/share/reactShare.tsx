"use client";

import { useState, useEffect } from "react";
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, EmailShareButton, WhatsappShareButton } from "react-share";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Facebook, Twitter, Linkedin, Mail, MessageCircle, Share2, Copy } from "lucide-react";

export default function ReactShareButton() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert("Link copiado!");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Share2 className="mr-2 w-5 h-5" />
          React share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <FacebookShareButton url={url}>
            <Facebook className="mr-2 w-5 h-5 text-blue-600" /> Facebook
          </FacebookShareButton>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <TwitterShareButton url={url}>
            <Twitter className="mr-2 w-5 h-5 text-sky-500" /> Twitter
          </TwitterShareButton>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <LinkedinShareButton url={url}>
            <Linkedin className="mr-2 w-5 h-5 text-blue-700" /> LinkedIn
          </LinkedinShareButton>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <WhatsappShareButton url={url}>
            <MessageCircle className="mr-2 w-5 h-5 text-green-500" /> WhatsApp
          </WhatsappShareButton>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <EmailShareButton url={url} subject="Veja isso!" body={url}>
            <Mail className="mr-2 w-5 h-5 text-gray-500" /> Email
          </EmailShareButton>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard}>
          <Copy className="mr-2 w-5 h-5 text-gray-500" /> Copiar Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
