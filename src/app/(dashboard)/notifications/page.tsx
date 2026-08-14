'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/lib/api/notification.api';
import type { Notification, RecipientType } from '@/types/school.types';
import { Bell, Check, Trash2, Plus, X } from 'lucide-react';
import { Pagination } from '@/components/shared/Pagination';
import { usePagination } from '@/lib/hooks/usePagination';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [showCompose, setShowCompose] = useState(false);

  // New notification form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState<RecipientType>('STUDENT');
  const [recipientId, setRecipientId] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('userId');
      if (storedId) setUserId(parseInt(storedId, 10));
      const role = localStorage.getItem('userRole');
      if (role) setUserRole(role);
    }
  }, []);

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['notifications', userId, userRole],
    queryFn: () => notificationApi.getByRecipient(userId!, userRole),
    enabled: !!userId && !!userRole,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => notificationApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => notificationApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Omit<Notification, 'id' | 'createdAt'>>) => 
      notificationApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setShowCompose(false);
      setTitle('');
      setMessage('');
      setRecipientId('');
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      message,
      recipientType,
      recipientId: recipientId ? parseInt(recipientId, 10) : undefined,
      isRead: false,
    });
  };

  const canCompose = userRole === 'ADMIN' || userRole === 'TEACHER';

  const { page, setPage, pagedItems, totalItems } = usePagination(notifications);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">Stay updated with the latest alerts</p>
        </div>
        {canCompose && !showCompose && (
          <button 
            onClick={() => setShowCompose(true)}
            className="flex items-center gap-2 bg-[#5b51ef] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-600 transition"
          >
            <Plus size={16} /> New Alert
          </button>
        )}
      </div>

      {showCompose && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
          <button 
            onClick={() => setShowCompose(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Send a Notification</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
              <input 
                type="text" 
                required 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#5b51ef] focus:ring-1 focus:ring-[#5b51ef] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
              <textarea 
                required 
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#5b51ef] focus:ring-1 focus:ring-[#5b51ef] outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Role</label>
                <select 
                  value={recipientType}
                  onChange={e => setRecipientType(e.target.value as RecipientType)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#5b51ef] focus:ring-1 focus:ring-[#5b51ef] outline-none"
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="PARENT">Parent</option>
                  <option value="STAFF">Staff</option>
                  <option value="ALL">All</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient ID (optional)</label>
                <input 
                  type="number" 
                  value={recipientId}
                  onChange={e => setRecipientId(e.target.value)}
                  placeholder="Leave blank to broadcast to role"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#5b51ef] focus:ring-1 focus:ring-[#5b51ef] outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                disabled={createMutation.isPending}
                className="bg-[#5b51ef] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-indigo-600 transition disabled:opacity-50"
              >
                {createMutation.isPending ? 'Sending...' : 'Send Notification'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-sm text-slate-500">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center flex flex-col items-center">
          <div className="h-12 w-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-3">
            <Bell size={24} />
          </div>
          <p className="text-slate-500 text-sm font-medium">You're all caught up!</p>
          <p className="text-slate-400 text-xs mt-1">No unread notifications at the moment.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <ul className="divide-y divide-slate-100">
            {pagedItems.map((notif) => (
              <li key={notif.id} className="p-4 hover:bg-slate-50 transition flex gap-4 items-start group">
                <div className="mt-1 flex-shrink-0 h-10 w-10 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center">
                  <Bell size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900">{notif.title}</p>
                  <p className="text-sm text-slate-600 mt-0.5 line-clamp-2">{notif.message}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'Just now'}
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button 
                    onClick={() => markReadMutation.mutate(notif.id)}
                    className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition"
                    title="Mark as read"
                  >
                    <Check size={18} />
                  </button>
                  <button 
                    onClick={() => deleteMutation.mutate(notif.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <Pagination page={page} pageSize={10} totalItems={totalItems} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
