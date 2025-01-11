"use client";
import Head from "next/head";
import dynamic from "next/dynamic";
import {CustomCameraWithModal} from "./camera";

export default function Camera() {
  return (
   <div className="min-h-screen overflow-y-auto">

    <CustomCameraWithModal />

   </div>
  );
}