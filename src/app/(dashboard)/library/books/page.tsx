'use client';

import React, { useEffect, useState } from 'react';
import { bookApi } from '@/lib/api/library.api';
import type { Book } from '@/types/api.types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/shared/Badge';

export default function LibraryBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await bookApi.getAll();
        setBooks(data);
      } catch (error) {
        console.error('Failed to load books:', error);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  const filteredBooks = books.filter((b) => {
    const query = search.toLowerCase();
    return (
      b.title.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query) ||
      b.isbn.toLowerCase().includes(query)
    );
  });

  const columns: Column<Book>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (b) => (
        <div className="font-semibold text-[#111827]">
          {b.title}
        </div>
      ),
    },
    { key: 'author', header: 'Author' },
    { key: 'isbn', header: 'ISBN' },
    { 
      key: 'availableCopies', 
      header: 'Available',
      render: (b) => (
        <span className="font-medium">
          {b.availableCopies} / {b.totalCopies}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (b) => {
        const status = b.availableCopies > 0 ? 'Available' : 'Unavailable';
        return <Badge variant={b.availableCopies > 0 ? 'green' : 'red'}>{status}</Badge>;
      }
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Library Books</h1>
        <p className="text-sm text-[#6b7280]">Manage library inventory and track book availability</p>
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search books by title, author, or ISBN..."
        actionLabel="Add Book"
        onAction={() => alert('Add Book modal placeholder')}
      />

      {loading ? (
        <LoadingSpinner text="Loading library books..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredBooks}
          keyExtractor={(b) => b.id}
          emptyMessage="No books found in the library."
        />
      )}
    </div>
  );
}
