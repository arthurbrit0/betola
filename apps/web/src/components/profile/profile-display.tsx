"use client";

import useSWR from 'swr';
import { Button } from '@/components/ui/button';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProfileDisplay() {
  const { data: profile, isLoading, error, mutate } = useSWR('/api/profile', fetcher);

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p className="text-destructive">Erro ao carregar perfil.</p>;

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Meu Perfil</h1>
      <div className="space-y-1 text-muted-foreground">
        <p><span className="font-medium text-foreground">Username:</span> @{profile.username}</p>
        <p><span className="font-medium text-foreground">Nome:</span> {profile.firstName ?? '-'} {profile.lastName ?? ''}</p>
        <p><span className="font-medium text-foreground">E-mail:</span> {profile.email ?? ''}</p>
      </div>
      <Button onClick={() => (window.location.href = '/profile/edit')}>Editar Perfil</Button>
    </div>
  );
} 