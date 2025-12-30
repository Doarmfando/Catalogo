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
  adapter?: (data: any) => T;
}

export function useRealtimeTable<T extends { id: string }>({
  table,
  initialData,
  select = '*',
  filter,
  adapter,
}: UseRealtimeTableOptions<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel;

    // Normalizar el select quitando espacios y saltos de línea para comparación
    const normalizedSelect = select.replace(/\s+/g, ' ').trim();
    const needsFullFetch = normalizedSelect !== '*';

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
            ...(filter && { filter: `${filter.column}=eq.${filter.value}` }),
          },
          async (payload) => {
            // Si necesitamos más datos que los que vienen en el payload
            if (needsFullFetch) {
              setLoading(true);
              const { data: newRecord } = await supabase
                .from(table)
                .select(select)
                .eq('id', (payload.new as any).id)
                .single();

              if (newRecord) {
                const adaptedRecord = adapter ? adapter(newRecord) : (newRecord as unknown as T);
                setData((current) => [...current, adaptedRecord]);
              }
              setLoading(false);
            } else {
              const adaptedPayload = adapter ? adapter(payload.new) : (payload.new as T);
              setData((current) => [...current, adaptedPayload]);
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: table,
            ...(filter && { filter: `${filter.column}=eq.${filter.value}` }),
          },
          async (payload) => {
            // Si necesitamos más datos que los que vienen en el payload
            if (needsFullFetch) {
              setLoading(true);
              const { data: updatedRecord } = await supabase
                .from(table)
                .select(select)
                .eq('id', (payload.new as any).id)
                .single();

              if (updatedRecord) {
                const adaptedRecord = adapter ? adapter(updatedRecord) : (updatedRecord as unknown as T);
                setData((current) =>
                  current.map((item) =>
                    item.id === (payload.new as any).id ? adaptedRecord : item
                  )
                );
              }
              setLoading(false);
            } else {
              const adaptedPayload = adapter ? adapter(payload.new) : (payload.new as T);
              setData((current) =>
                current.map((item) =>
                  item.id === (payload.new as any).id ? adaptedPayload : item
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
            ...(filter && { filter: `${filter.column}=eq.${filter.value}` }),
          },
          (payload) => {
            setData((current) =>
              current.filter((item) => item.id !== (payload.old as any).id)
            );
          }
        )
        .subscribe();
    };

    setupRealtimeSubscription();

    // Cleanup al desmontar
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, select, filter?.column, filter?.value, adapter]);

  return { data, loading };
}
