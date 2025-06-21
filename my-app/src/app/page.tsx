"use client";
import { Cpu } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white text-center p-8">
      <div className="flex items-center space-x-4 mb-8">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 via-teal-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20">
          <Cpu className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-300 via-teal-300 to-violet-300 bg-clip-text text-transparent">
          TaskFlow AI
        </h1>
      </div>
      <p className="max-w-xl mb-8 text-lg text-gray-300">
        Bienvenido a TaskFlow AI, tu asistente inteligente para la gestión de
        tareas. Inicia sesión o regístrate para comenzar a organizar tu trabajo
        de forma eficiente.
      </p>
      <div className="flex space-x-4">
        <a href="/auth/login">Iniciar sesión</a>
      </div>
    </div>
  );
}
