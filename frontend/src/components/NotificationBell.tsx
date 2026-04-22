"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/lib/useNotifications";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { Notification } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

const NOTIFICATION_ICONS: Record<string, string> = {
    DONOR_NEEDED: "🩸",
    REQUEST_ACCEPTED: "✅",
    REQUEST_COMPLETED: "🎉",
    REQUEST_CANCELLED: "❌",
    DONOR_MATCH: "💉",
};

export function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const { messages, requestNotificationPermission } = useWebSocket();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Request actual push notification permissions on mount
        requestNotificationPermission();
    }, [requestNotificationPermission]);

    // Live WebSocket messages could be integrated into the state management here
    // For now, we rely on the hook which triggers native notifications.

    const handleClick = async (notification: Notification) => {
        if (!notification.is_read) {
            await markAsRead(notification.id);
        }
        if (notification.related_request) {
            router.push(`/request/${notification.related_request.id}`);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                aria-label="Toggle notifications"
            >
                <div className="absolute inset-0 rounded-full border border-slate-200 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors" />
                
                <AnimatePresence>
                    {(unreadCount > 0 || messages.length > 0) && (
                        <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded-full translate-x-1/3 -translate-y-1/3 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                        >
                            {(unreadCount + messages.length) > 99 ? "99+" : (unreadCount + messages.length)}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98, filter: "blur(4px)" }}
                            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: 10, scale: 0.98, filter: "blur(4px)" }}
                            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                            className="absolute right-0 mt-3 w-96 z-50 flex flex-col p-1.5 rounded-[1.5rem] bg-white/5 dark:bg-black/10 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 dark:border-white/10"
                        >
                            <div className="flex-1 max-h-[600px] overflow-hidden rounded-[calc(1.5rem-0.375rem)] bg-white dark:bg-zinc-950 flex flex-col">
                                <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                                    <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Notifications</h3>
                                    {(unreadCount > 0 || messages.length > 0) && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium transition-colors"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>

                                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                                    {(notifications.length === 0 && messages.length === 0) ? (
                                        <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-3">
                                                <Bell className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <p className="font-medium text-sm">Quiet right now</p>
                                            <p className="text-xs mt-1 text-slate-400">You&apos;re all caught up on alerts.</p>
                                        </div>
                                    ) : (
                                        [...messages.map((m, i) => ({ id: `ws-${i}`, title: 'Live Update', message: m.message, is_read: false, created_at: new Date().toISOString(), type: 'DONOR_NEEDED' })), ...notifications].map((notification, i) => (
                                            <motion.button
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 + 0.1 }}
                                                key={notification.id}
                                                onClick={() => handleClick(notification as any)}
                                                className={`w-full p-4 rounded-xl transition-colors text-left flex gap-4 ${!notification.is_read ? "bg-red-50 dark:bg-red-900/10" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}
                                            >
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-inner mt-1 ${notification.type === "DONOR_NEEDED" ? "bg-red-100 dark:bg-red-500/20" : "bg-emerald-100 dark:bg-emerald-500/20"}`}>
                                                    <span className="text-lg">
                                                        {NOTIFICATION_ICONS[notification.type] ?? "🔔"}
                                                    </span>
                                                </div>

                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <p className="font-semibold text-slate-900 dark:text-slate-100 text-[14px] leading-tight flex justify-between items-start gap-2">
                                                        <span className="truncate">{notification.title}</span>
                                                        {!notification.is_read && (
                                                            <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)] mt-1.5" />
                                                        )}
                                                    </p>
                                                    <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-1 pb-1 line-clamp-2 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                                                        {formatDistanceToNow(new Date(notification.created_at), {
                                                            addSuffix: true,
                                                        })}
                                                    </p>
                                                </div>
                                            </motion.button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
