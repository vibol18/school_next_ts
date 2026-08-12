'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface Route {
  id: number;
  routeName: string;
  startLocation: string;
  endLocation: string;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
}

export default function TransportRoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Mock data for transport routes
    setTimeout(() => {
      setRoutes([
        { id: 1, routeName: 'Route 1 - City Center', startLocation: 'North Square', endLocation: 'School Campus', vehicleNumber: 'BUS-1001', driverName: 'Michael Scott', driverContact: '555-0123' },
        { id: 2, routeName: 'Route 2 - Suburbs', startLocation: 'West End', endLocation: 'School Campus', vehicleNumber: 'BUS-1002', driverName: 'Jim Halpert', driverContact: '555-0124' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredRoutes = routes.filter((r) => {
    const query = search.toLowerCase();
    return (
      r.routeName.toLowerCase().includes(query) ||
      r.driverName.toLowerCase().includes(query) ||
      r.vehicleNumber.toLowerCase().includes(query)
    );
  });

  const columns: Column<Route>[] = [
    { key: 'routeName', header: 'Route Name', render: (r) => <span className="font-semibold text-[#111827]">{r.routeName}</span> },
    { key: 'startLocation', header: 'Start Location' },
    { key: 'vehicleNumber', header: 'Vehicle No.' },
    { key: 'driverName', header: 'Driver' },
    { key: 'driverContact', header: 'Contact' },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <button className="text-xs text-[#4f46e5] hover:text-[#4338ca] font-medium bg-[#e5e5fa] px-2 py-1 rounded">
          Edit Route
        </button>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Transport Routes</h1>
        <p className="text-sm text-[#6b7280]">Manage bus routes, drivers, and vehicle assignments</p>
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search routes by name or driver..."
        actionLabel="Add Route"
        onAction={() => alert('Add Route modal placeholder')}
      />

      {loading ? (
        <LoadingSpinner text="Loading routes..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredRoutes}
          keyExtractor={(r) => r.id}
          emptyMessage="No transport routes found."
        />
      )}
    </div>
  );
}
