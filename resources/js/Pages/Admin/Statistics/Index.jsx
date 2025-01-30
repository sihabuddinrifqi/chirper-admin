import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

export default function Index() {
    const [statistics, setStatistics] = useState({
        users: null,
        chirps: null,
        reports: null,
    });

    const [filters, setFilters] = useState({
        start_date: '',
        end_date: '',
        is_active: '',
        is_resolved: '',
    });

    const [loading, setLoading] = useState(false);
    const [activeRange, setActiveRange] = useState(''); // State untuk melacak tombol aktif

    const fetchStatistics = async () => {
        setLoading(true);

        try {
            const query = new URLSearchParams(filters).toString();
            const endpoints = [
                `/statistics/users?${query}`,
                `/statistics/chirps?${query}`,
                `/statistics/reports?${query}`,
            ];

            const responses = await Promise.all(
                endpoints.map((url) => fetch(url).then((res) => res.json()))
            );

            setStatistics({
                users: responses[0].count || 0,
                chirps: responses[1].count || 0,
                reports: responses[2].count || 0,
            });
        } catch (error) {
            console.error('Error fetching statistics:', error);
            setStatistics({
                users: 0,
                chirps: 0,
                reports: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDateRange = (range) => {
        const now = new Date();
        let start_date, end_date;

        if (range === 'daily') {
            start_date = end_date = now.toISOString().split('T')[0];
        } else if (range === 'weekly') {
            const startOfWeek = new Date(
                now.setDate(now.getDate() - now.getDay())
            );
            start_date = startOfWeek.toISOString().split('T')[0];
            end_date = new Date().toISOString().split('T')[0];
        } else if (range === 'monthly') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            start_date = startOfMonth.toISOString().split('T')[0];
            end_date = new Date().toISOString().split('T')[0];
        }

        const utcEndDate = new Date(end_date);
        utcEndDate.setDate(utcEndDate.getDate() + 1);

        setFilters((prev) => ({
            ...prev,
            start_date,
            end_date: utcEndDate.toISOString().split('T')[0],
        }));

        setActiveRange(range); // Update tombol yang aktif
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            start_date: '',
            end_date: '',
            is_active: '',
            is_resolved: '',
        });
        setActiveRange(''); // Reset tombol aktif
    };

    useEffect(() => {
        fetchStatistics();
    }, [filters]);

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard with Filters" />
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-4">Statistics</h1>
                    <div className="mb-4 flex gap-4">
                        <button
                            onClick={() => handleDateRange('daily')}
                            className={`px-4 py-2 rounded-lg ${
                                activeRange === 'daily'
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-blue-500 text-white'
                            }`}
                        >
                            Harian
                        </button>
                        <button
                            onClick={() => handleDateRange('weekly')}
                            className={`px-4 py-2 rounded-lg ${
                                activeRange === 'weekly'
                                    ? 'bg-yellow-700 text-white'
                                    : 'bg-yellow-500 text-white'
                            }`}
                        >
                            Mingguan
                        </button>
                        <button
                            onClick={() => handleDateRange('monthly')}
                            className={`px-4 py-2 rounded-lg ${
                                activeRange === 'monthly'
                                    ? 'bg-green-700 text-white'
                                    : 'bg-green-500 text-white'
                            }`}
                        >
                            Bulanan
                        </button>
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg"
                        >
                            Reset Filter
                        </button>
                    </div>
                    <div className="mb-4 flex gap-4">
                        <select
                            onChange={(e) =>
                                handleFilterChange('is_active', e.target.value)
                            }
                            value={filters.is_active}
                            className="w-full px-4 py-2 border rounded-lg"
                        >
                            <option value="">Filter Active Users</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                            <option value="all">All</option>
                        </select>
                        <select
                            onChange={(e) =>
                                handleFilterChange(
                                    'is_resolved',
                                    e.target.value
                                )
                            }
                            value={filters.is_resolved}
                            className="w-full px-4 py-2 border rounded-lg"
                        >
                            <option value="">Filter Resolved Reports</option>
                            <option value="1">Resolved</option>
                            <option value="0">Unresolved</option>
                            <option value="all">All</option>
                        </select>
                    </div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-100 p-4 rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold">Users</h2>
                                <p className="text-2xl font-bold">
                                    {statistics.users ?? 'N/A'}
                                </p>
                            </div>
                            <div className="bg-green-100 p-4 rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold">
                                    Chirps
                                </h2>
                                <p className="text-2xl font-bold">
                                    {statistics.chirps ?? 'N/A'}
                                </p>
                            </div>
                            <div className="bg-red-100 p-4 rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold">
                                    Reports
                                </h2>
                                <p className="text-2xl font-bold">
                                    {statistics.reports ?? 'N/A'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
