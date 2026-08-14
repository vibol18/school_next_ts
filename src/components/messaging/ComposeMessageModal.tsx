'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { usersApi } from '@/lib/api/users';
import { messageApi } from '@/lib/api/communication.api';
import type { UserRecipient } from '@/types/api.types';
import { Send, Loader2 } from 'lucide-react';

interface ComposeMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: number;
  initialRecipientId?: number;
  initialSubject?: string;
  onSent?: () => void;
}

export function ComposeMessageModal({
  isOpen,
  onClose,
  currentUserId,
  initialRecipientId,
  initialSubject,
  onSent,
}: ComposeMessageModalProps) {
  const [recipients, setRecipients] = useState<UserRecipient[]>([]);
  const [receiverId, setReceiverId] = useState<string>(initialRecipientId ? String(initialRecipientId) : '');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setReceiverId(initialRecipientId ? String(initialRecipientId) : '');
    setSubject(initialSubject ?? '');
    setBody('');
    usersApi
      .getRecipients()
      .then((list) => {
        setRecipients(list.filter((r) => r.id !== currentUserId));
        if (!initialRecipientId && list.length > 0) {
          const first = list.find((r) => r.id !== currentUserId);
          if (first) setReceiverId(String(first.id));
        }
      })
      .catch(() => setError('Could not load recipient list.'));
  }, [isOpen, currentUserId, initialRecipientId, initialSubject]);

  const recipientLabel = (r: UserRecipient) =>
    `${r.firstName || ''} ${r.lastName || ''}`.trim() || r.username;

  const recipientOptions = useMemo(() => {
    return recipients
      .slice()
      .sort((a, b) => (a.role || '').localeCompare(b.role || ''));
  }, [recipients]);

  const grouped = useMemo(() => {
    const groups = new Map<string, UserRecipient[]>();
    for (const r of recipientOptions) {
      const key = r.role || 'OTHER';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(r);
    }
    return Array.from(groups.entries());
  }, [recipientOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverId || !subject.trim() || !body.trim()) {
      setError('Please select a recipient and fill in subject and message.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await messageApi.send({
        receiverId: Number(receiverId),
        subject: subject.trim(),
        body: body.trim(),
      });
      onSent?.();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Compose Message" className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">To</label>
          <select
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            disabled={submitting}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#5b51ef]/20 focus:border-[#5b51ef]"
          >
            {!receiverId && <option value="">Select recipient...</option>}
            {grouped.map(([role, list]) => (
              <optgroup key={role} label={role}>
                {list.map((r) => (
                  <option key={r.id} value={r.id}>
                    {recipientLabel(r)} ({r.username}) — {r.role}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b51ef]/20 focus:border-[#5b51ef]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message..."
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b51ef]/20 focus:border-[#5b51ef] resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#5b51ef] hover:bg-[#4b42db] rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send
          </button>
        </div>
      </form>
    </Dialog>
  );
}
