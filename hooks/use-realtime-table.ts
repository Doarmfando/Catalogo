/**
 * Hook personalizado para suscribirse a cambios en tiempo real de una tabla de Supabase
 */

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeTableOptions<T> {
  table: string;
  initialData: T[];
  select?: string;
  filter?: {
    column: string;
    value: any;
  };
}

export function useRealtimeTable<T extends { id: string }>({
  table,
  initialData,
  select = '*',
  filter,
}: UseRealtimeTableOptions<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel;

    const setupRealtimeSubscription = () => {
      // Configurar canal de Realtime
      channel = supabase
        .channel(`realtime:${table}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: table,
            filter: filter ? `${filter.column}=eq.${filter.value}` : undefined,
          },
          async (payload) => {
            console.log(`[Realtime] INSERT en ${table}:`, payload.new);

            // Si necesitamos más datos que los que vienen en el payload
            if (select !== '*') {
              setLoading(true);
              const { data: newRecord } = await supabase
                .from(table)
                .select(select)
                .eq('id', (payload.new as any).id)
                .single();

              if (newRecord) {
                setData((current) => [...current, newRecord as unknown as T]);
              }
              setLoading(false);
            } else {
              setData((current) => [...current, payload.new as T]);
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: table,
            filter: filter ? `${filter.column}=eq.${filter.value}` : undefined,
          },
          async (payload) => {
            console.log(`[Realtime] UPDATE en ${table}:`, payload.new);

            // Si necesitamos más datos que los que vienen en el payload
            if (select !== '*') {
              setLoading(true);
              const { data: updatedRecord } = await supabase
                .from(table)
                .select(select)
                .eq('id', (payload.new as any).id)
                .single();

              if (updatedRecord) {
                setData((current) =>
                  current.map((item) =>
                    item.id === (payload.new as any).id ? (updatedRecord as unknown as T) : item
                  )
                );
              }
              setLoading(false);
            } else {
              setData((current) =>
                current.map((item) =>
                  item.id === (payload.new as any).id ? (payload.new as T) : item
                )
              );
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: table,
            filter: filter ? `${filter.column}=eq.${filter.value}` : undefined,
          },
          (payload) => {
            console.log(`[Realtime] DELETE en ${table}:`, payload.old);
            setData((current) =>
              current.filter((item) => item.id !== (payload.old as any).id)
            );
          }
        )
        .subscribe((status) => {
          console.log(`[Realtime] Status para ${table}:`, status);
        });
    };

    setupRealtimeSubscription();

    // Cleanup al desmontar
    return () => {
      if (channel) {
        console.log(`[Realtime] Limpiando suscripción de ${table}`);
        supabase.removeChannel(channel);
      }
    };
  }, [table, select, filter?.column, filter?.value]);

  return { data, loading };
}
