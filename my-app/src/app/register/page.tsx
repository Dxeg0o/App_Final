"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.error || 'Error al crear usuario');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-slate-800">
      <form onSubmit={handleSubmit} className="bg-gray-800/60 backdrop-blur-xl p-8 rounded-xl space-y-4 w-80">
        <h1 className="text-2xl font-semibold text-white text-center">Registro</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Input placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-white/5 text-white" />
        <Input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white/5 text-white" />
        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">Crear Cuenta</Button>
      </form>
    </div>
  );
}
