"use client";

import CustomBreadcrumb from '@/components/custom-breadcrumb';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { ResponseData } from '../next-exam/types';
import { ExamCard } from './examCard';
import { _axios } from '@/Api/axios.config';

const SkeletonCard = () => (
  <div className="bg-gray-200 animate-pulse shadow-lg rounded-xl p-6 mb-6 flex flex-col md:flex-row md:justify-between items-start md:items-center">
    <div className="space-y-2 w-full">
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
    </div>
    <div className="flex flex-col min-h-full w-1/3">
      <div className="h-8 bg-gray-300 rounded w-full"></div>
    </div>
  </div>
);

const UpcomingExams = () => {
  //@ts-ignore
  const { id } = useParams();
  const [filter, setFilter] = useState('');

  const { data, isPending } = useQuery({
    queryKey: ["next-exam"],
    queryFn: async () => {
      return await _axios.get<ResponseData>(`/exams/next/${id}`);
    }
  });
  const userName = useQuery({
    queryKey: ["user-name"],
    queryFn: async () => {
      return await _axios.get(`/pacients/${id}`);
    }
  });

  const breadcrumbItems = [
    { label: "Paciente", href: "/akin/patient" },
    { label: "Perfil do paciente", href: `/akin/patient/${id}` },
    { label: "Próximos Exames" },
  ];

  const filteredData = filter
    ? data?.data.data.filter((exam) =>
        exam.Tipo_Exame.nome.toLowerCase().includes(filter.toLowerCase())
      )
    : data?.data.data;

  return (
    <div className="min-h-screen overflow-y-scroll [&::-webkit-scrollbar]:hidden">
      <CustomBreadcrumb items={breadcrumbItems} borderB />

      <div className="bg-white shadow-md rounded-lg px-3 md:px-5 py-4 flex items-center my-5">
        <div className="flex flex-col gap-3 h-max lg:h-5 lg:flex-row lg:items-center lg:justify-between items-start text-sm w-full">
          <p className="text-md text-gray-600 font-medium w-full">
            Nome do Paciente: {" "}
            <span className="font-medium text-md text-gray-900">
              {userName.data?.data.nome_completo}
            </span>
          </p>
          <input
            type="text"
            placeholder="Buscar exames..."
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div>
        {isPending ? (
          <>
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </>
        ) : (
          <ExamCard data={filteredData!} name_patient={userName.data?.data.nome_completo} />
        )}
      </div>
    </div>
  );
};

export default UpcomingExams;
