"use client";

import { useState, useEffect, useCallback } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";
import type { Notification } from "@/types";

const POLL_INTERVAL_MS = 20_000;

interface UseNotificationsReturn {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    refresh: () => void;
}

export function useNotifications(): UseNotificationsReturn {
    const { user } = useUser();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchAll = useCallback(async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await (supabaseClient as any)
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(30);

            if (!error && data) {
                setNotifications(data as any);
                setUnreadCount(data.filter((n: any) => !n.is_read).length);
            }
        } catch {
            // Silently fail — polling will retry
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    const markAsRead = useCallback(
        async (id: number) => {
            await (supabaseClient as any)
                .from('notifications')
                .update({ is_read: true })
                .eq('id', id);
            await fetchAll();
        },
        [fetchAll]
    );

    const markAllAsRead = useCallback(async () => {
        if (!user?.id) return;
        await (supabaseClient as any)
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);
        await fetchAll();
    }, [user?.id, fetchAll]);

    useEffect(() => {
        fetchAll();
        const interval = setInterval(fetchAll, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [fetchAll]);

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refresh: fetchAll,
    };
}
