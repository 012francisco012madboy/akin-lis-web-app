"use client";
// import Head from "next/head";
// import dynamic from "next/dynamic";
// import CustomCamera from "./camera";
import React, { useState } from 'react';

export default function Camera() {
  return (
    <div className="min-h-screen overflow-y-auto">
      camera
      {/* <CustomCamera /> */}
      <ChatkinRequest />
    </div>
  );
}


const ChatkinRequest = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('https://chatkin.osapicare.com/recepsionista', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Oi',
          user_id: 'cmc2dcxdy0001f40zj9evza1v',
          session_id: 'sjkd',
          email: 'rec@gmail.com',
          senha: 'rec2025',
        }),
      });

      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log('Resposta do Chatkin:', data);
      setResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setError(err.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Enviar mensagem ao Chatkin</h1>
      <button
        onClick={handleSendRequest}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Enviar'}
      </button>

      {response && (
        <pre className="mt-4 p-2 bg-gray-100 border rounded overflow-x-auto">
          {response}
        </pre>
      )}

      {error && (
        <p className="text-red-600 mt-4">Erro: {error}</p>
      )}
    </div>
  );
};