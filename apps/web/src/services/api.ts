import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';
import type { WeightLogInput, BPLogInput, ProfileInput, UserProfile } from '@vita/shared';

export interface WeightLog {
  id: string;
  weight: number;
  loggedAt: string;
}

export interface BPLog {
  id: string;
  systolic: number;
  diastolic: number;
  loggedAt: string;
}

export function useWeightHistory(timeframe = 'all') {
  return useQuery({
    queryKey: ['weight-history', timeframe],
    queryFn: () => apiFetch<WeightLog[]>(`/metrics/weight?timeframe=${timeframe}`),
  });
}

export function useBPHistory(timeframe = 'all') {
  return useQuery({
    queryKey: ['bp-history', timeframe],
    queryFn: () => apiFetch<BPLog[]>(`/metrics/blood-pressure?timeframe=${timeframe}`),
  });
}

export function useLogWeight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WeightLogInput) =>
      apiFetch<WeightLog>('/metrics/weight', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['weight-history'] });
    },
  });
}

export function useLogBP() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BPLogInput) =>
      apiFetch<BPLog>('/metrics/blood-pressure', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['bp-history'] });
    },
  });
}

export function useUpdateWeight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: WeightLogInput }) =>
      apiFetch<WeightLog>(`/metrics/weight/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['weight-history'] });
    },
  });
}

export function useDeleteWeight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/metrics/weight/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['weight-history'] });
    },
  });
}

export function useUpdateBP() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BPLogInput }) =>
      apiFetch<BPLog>(`/metrics/blood-pressure/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['bp-history'] });
    },
  });
}

export function useDeleteBP() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/metrics/blood-pressure/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['bp-history'] });
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => apiFetch<UserProfile | null>('/profile'),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProfileInput) =>
      apiFetch<UserProfile>('/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
