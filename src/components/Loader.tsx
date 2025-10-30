"use client";
import Image from "next/image";
import "../styles/loader.css" // создадим файл чуть ниже

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-logo">
        <Image src="/logo.svg" alt="Loader Logo" fill className="object-contain" />
      </div>
      <p className="loader-text">
        Загрузка<span>.</span><span>.</span><span>.</span>
      </p>
    </div>
  );
}
