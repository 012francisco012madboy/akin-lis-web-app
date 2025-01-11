"use client";
import Head from "next/head";
import dynamic from "next/dynamic";
import {CameraSelector} from "./camera";

export default function Camera() {
  return (
   <div>
    ola

    <CameraSelector />

   </div>
  );
}


{/* <>
<Head>
  <title>Testar Câmeras - Next.js</title>
  <meta name="description" content="Teste de integração de câmeras em Next.js" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</Head>
<main style={{ padding: "16px" }}>
  <CameraSelector />
</main>
</> */}