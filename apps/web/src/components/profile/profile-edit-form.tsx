"use client";

import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const fetcher = (url: string) => fetch(url).then(r => r.json());

const schema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  avatarUrl: z.string().url('URL inválida').nullable().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

export default function ProfileEditForm() {
  const { data: profile, isLoading } = useSWR('/api/profile', fetcher);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      username: profile?.username ?? '',
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
      avatarUrl: profile?.avatarUrl ?? '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message);
        return;
      }
      window.location.href = '/profile';
    } catch (e) {
      alert('Erro inesperado');
    }
  };

  if (isLoading) return <p>Carregando...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md mx-auto">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...register('username')} />
        {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
      </div>
      <div>
        <Label htmlFor="firstName">Nome</Label>
        <Input id="firstName" {...register('firstName')} />
      </div>
      <div>
        <Label htmlFor="lastName">Sobrenome</Label>
        <Input id="lastName" {...register('lastName')} />
      </div>
      <div>
        <Label htmlFor="avatarUrl">Avatar URL</Label>
        <Input id="avatarUrl" {...register('avatarUrl')} />
        {errors.avatarUrl && <p className="text-sm text-destructive">{errors.avatarUrl.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">Salvar</Button>
    </form>
  );
} 