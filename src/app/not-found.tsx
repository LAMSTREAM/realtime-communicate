import Link from 'next/link';
import Image from "next/image";
import {config} from "@@/project-meta-config";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100">
      <div className="text-center">
        <Image
          src={`${config.basePath}/logo.png`} alt={`SChat`}
          className={`mx-auto`}
          width={198} height={198}
          priority
        />
        <h1 className="text-4xl font-bold text-gray-800 mb-6">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">Sorry, the page you are looking for does not exist.</p>
        <Link
          href="/session"
          className="text-lg font-medium text-blue-600 hover:text-blue-800"
        >
          Go to main page
        </Link>
      </div>
    </div>
  );
}
