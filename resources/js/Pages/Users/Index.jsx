import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ auth, title, all_user }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            destroy(route('users.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={title} />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h1 className="text-xl font-semibold mb-4">Users List</h1>
                        
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Roles</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Total Chirps</th>
                                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {all_user.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {user.is_active ? (
                                                <span className="text-green-500">Active</span>
                                            ) : (
                                                <span className="text-red-500">Non Active</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.roles && user.roles.length > 0
                                                ? user.roles.map((role) => role.name).join(', ') // Menggunakan join untuk menggabungkan role jika ada lebih dari satu
                                                : 'No roles assigned'}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.total_chirps}</td>
                                        <td>
                                            <Link
                                                href={route('users.edit', user.id)}
                                                className="text-yellow-600 hover:text-yellow-900 mr-2"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {all_user.length === 0 && (
                            <p className="text-gray-500 mt-4">No users found.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
