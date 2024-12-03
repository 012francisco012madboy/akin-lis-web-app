"use client"
import { ChevronRight } from "lucide-react";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  borderB?:boolean;
}

const CustomBreadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = "",
  borderB
}) => {
  return (
    <nav className={` ${borderB? "border-b":""} pb-3 ${className}`} aria-label="breadcrumb">
      <ol className="flex text-lg flex-wrap">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li>
              {item.href ? (
                <a href={item.href} className="text-gray-500 hover:text-gray-600">
                  {item.label}
                </a>
              ) : (
                <span className="text-akin-turquoise font-bold text-xl ">{item.label}</span>
              )}
            </li>
            {index < items.length - 1 && (
              <li className="mx-2 text-gray-400 flex items-center"><ChevronRight size={14}/></li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default CustomBreadcrumb;
