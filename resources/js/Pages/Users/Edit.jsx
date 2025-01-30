import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm } from '@inertiajs/react';

export default function EditUser({ edit_user, roles }) {
    const { data, setData, put, processing, errors } = useForm({
        name: edit_user.name,
        password: '',
        is_active: edit_user.is_active,
        role_ids: edit_user.roles ? edit_user.roles.map(role => role.id) : [], 
    });

    const handleRoleChange = (e) => {
        const selectedRoles = Array.from(e.target.selectedOptions, (option) => option.value);
        setData('role_ids', selectedRoles);
    };

    const submit = (e) => {
        e.preventDefault();

        put(route('users.update', edit_user.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit User" />

            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h1 className="text-xl font-semibold mb-4">Edit User</h1>
                        <form onSubmit={submit}>
                            {/* Email Field (Disabled) */}
                            <div className="mb-4">
                                <InputLabel htmlFor="email" value="Email" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={edit_user.email} 
                                    className="mt-1 block w-full bg-gray-100 cursor-not-allowed"
                                    disabled 
                                />
                            </div>

                            {/* Name Field */}
                            <div className="mb-4">
                                <InputLabel htmlFor="name" value="Name" />

                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('name', e.target.value)}
                                    autoComplete="name"
                                    isFocused={true}
                                />

                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Password Field */}
                            <div className="mb-4">
                                <InputLabel htmlFor="password" value="Password" />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="new-password"
                                />

                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Is Active Toggle */}
                            <div className="mb-4 flex items-center">
                                <InputLabel htmlFor="is_active" value="Status" />
                                <button
                                    type="button"
                                    onClick={() => setData('is_active', !data.is_active)}
                                    className={`ml-4 px-4 py-2 rounded-md ${
                                        data.is_active
                                            ? 'bg-green-500 text-white'
                                            : 'bg-red-500 text-white'
                                    }`}
                                >
                                    {data.is_active ? 'Active' : 'Non Active'}
                                </button>
                            </div>

                            {/* Roles */}
                            <div>
                                <label htmlFor="roles" className="block text-sm font-medium text-gray-700">Roles</label>
                                <select
                                    id="roles"
                                    name="roles"
                                    multiple
                                    value={data.role_ids}
                                    onChange={handleRoleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                >
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.role_ids && <span className="text-red-600 text-sm">{errors.role_ids}</span>}
                            </div>


                            <div className="flex items-center justify-end">
                                <PrimaryButton className="ml-4" disabled={processing}>
                                    Save
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
