'use client';

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/shared/Badge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Dialog } from '@/components/ui/dialog';
import { ComposeMessageModal } from '@/components/messaging/ComposeMessageModal';
import { messageApi } from '@/lib/api/communication.api';
import type { Message } from '@/types/api.types';
import { Reply, Trash2 } from 'lucide-react';

function formatDate(value?: string) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function InboxPage() {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [selected, setSelected] = useState<Message | null>(null);
  const [replyTarget, setReplyTarget] = useState<Message | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('userId');
      if (storedId) setUserId(parseInt(storedId, 10));
    }
  }, []);

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['messages-inbox', userId],
    queryFn: () => messageApi.getInbox(userId!),
    enabled: !!userId,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => messageApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages-inbox', userId] });
      queryClient.invalidateQueries({ queryKey: ['messages-unread', userId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => messageApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages-inbox', userId] });
      queryClient.invalidateQueries({ queryKey: ['messages-unread', userId] });
      setDeleteTarget(null);
      setSelected(null);
    },
  });

  const openMessage = (m: Message) => {
    setSelected(m);
    if (!m.isRead) markReadMutation.mutate(m.id);
  };

  const handleReply = (m: Message) => {
    setReplyTarget(m);
    setSelected(null);
  };

  const filteredMessages = messages.filter((m) => {
    const query = search.toLowerCase();
    return (
      m.senderName?.toLowerCase().includes(query) ||
      m.subject?.toLowerCase().includes(query)
    );
  });

  const columns: Column<Message>[] = [
    {
      key: 'senderName',
      header: 'From',
      render: (m) => (
        <div className="flex items-center gap-2">
          <span className={`text-[#111827] ${!m.isRead ? 'font-bold' : 'font-medium'}`}>
            {m.senderName}
          </span>
          {!m.isRead && (
            <span className="w-2 h-2 rounded-full bg-[#5b51ef]" title="Unread" />
          )}
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (m) => (
        <div className="min-w-0">
          <span className={`text-[#111827] ${!m.isRead ? 'font-bold' : 'font-normal'}`}>
            {m.subject}
          </span>
          {m.body && (
            <p className="text-xs text-[#6b7280] truncate max-w-xs">{m.body}</p>
          )}
        </div>
      ),
    },
    {
      key: 'sentAt',
      header: 'Received On',
      render: (m) => <span className="text-sm text-[#4b5563]">{formatDate(m.sentAt)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (m) => <Badge variant={m.isRead ? 'slate' : 'indigo'}>{m.isRead ? 'Read' : 'New'}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (m) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openMessage(m)}
            className="text-xs text-[#4f46e5] hover:text-[#4338ca] font-medium bg-[#e5e5fa] px-2 py-1 rounded"
          >
            Read
          </button>
          <button
            onClick={() => handleReply(m)}
            className="text-xs text-[#0f766e] hover:text-[#115e59] font-medium bg-[#ccfbf1] px-2 py-1 rounded"
          >
            Reply
          </button>
          <button
            onClick={() => setDeleteTarget(m)}
            className="text-xs text-red-600 hover:text-red-700 font-medium bg-red-50 px-2 py-1 rounded"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Messages Inbox</h1>
        <p className="text-sm text-[#6b7280]">View and respond to internal communications</p>
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search messages by sender or subject..."
        actionLabel="Compose Message"
        onAction={() => setComposeOpen(true)}
      />

      {isLoading ? (
        <LoadingSpinner text="Loading messages..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredMessages}
          keyExtractor={(m) => m.id}
          emptyMessage="No messages found in your inbox."
        />
      )}

      <ComposeMessageModal
        isOpen={composeOpen}
        onClose={() => setComposeOpen(false)}
        currentUserId={userId ?? 0}
        onSent={() => queryClient.invalidateQueries({ queryKey: ['messages-inbox', userId] })}
      />

      <ComposeMessageModal
        isOpen={!!replyTarget}
        onClose={() => setReplyTarget(null)}
        currentUserId={userId ?? 0}
        initialRecipientId={replyTarget?.senderId}
        initialSubject={replyTarget ? `Re: ${replyTarget.subject}` : undefined}
        onSent={() => queryClient.invalidateQueries({ queryKey: ['messages-inbox', userId] })}
      />

      <Dialog isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.subject}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-[#6b7280] border-b border-gray-100 pb-3">
              <div>
                <span className="font-semibold text-[#111827]">From: </span>
                {selected.senderName}
              </div>
              <div>
                <span className="font-semibold text-[#111827]">Received: </span>
                {formatDate(selected.sentAt)}
              </div>
            </div>
            <p className="text-sm text-[#374151] whitespace-pre-wrap leading-relaxed">{selected.body}</p>
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleReply(selected)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#5b51ef] hover:bg-[#4b42db] rounded-lg transition-colors"
              >
                <Reply className="w-4 h-4" />
                Reply
              </button>
            </div>
          </div>
        )}
      </Dialog>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Delete Message"
        message={`Are you sure you want to delete the message "${deleteTarget?.subject}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
