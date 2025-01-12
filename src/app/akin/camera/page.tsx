"use client";
import Head from "next/head";
import dynamic from "next/dynamic";
import { CustomCamera } from "./camera";

export default function Camera() {
  return (
    <div className="min-h-screen overflow-y-auto">

      <CustomCamera />

    </div>
  );
}