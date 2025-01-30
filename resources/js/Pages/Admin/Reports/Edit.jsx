import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm } from '@inertiajs/react';
import React, { useRef, useState, useEffect} from "react";
import TextEditor from "@/Components/TextEditor";
import { router, usePage } from '@inertiajs/react';

export default function Edit({ report }) {
    const props = usePage().props;
    console.log(props, props.csrf_token);

    const { data, setData, put, processing, errors } = useForm({
        notes : report.notes,
        is_resolved : report.is_resolved,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.reports.update', report.id), {
            preserveScroll: true,
        });
    };

    const trixInput = useRef(null);
    trixInput.current = (report.chirp && report.chirp.message) ? report.chirp.message : '';

    useEffect(() => {
        if (trixInput.current) {
            const editor = trixInput.current.editor;
            if (report.chirp && report.chirp.message) {
                // Load the chirp message into the editor
                editor.loadHTML(report.chirp.message);
            } else {
                // Clear the editor content if chirp is deleted
                editor.loadHTML('');
            }
        }
    }, [report.chirp]);

    const hashtags = [];
    if(report.chirp) {
        const hashtags = report.chirp.hashtags ? report.chirp.hashtags.split('|') : [];
    }


    // DELETE CHIRP
    const [isChirpDeleted, setIsChirpDeleted] = useState(report.chirp ? false : true);

    const handleDeleteChirp = (id) => {
        if (!id) {
            console.error('Invalid chirp ID');
            return;
        }
        const confirmed = window.confirm('Are you sure you want to delete this chirp? This action cannot be undone.');
        if (confirmed) {
            const formData = new FormData();
            formData.append('_method', 'DELETE');
            formData.append('_token', props.csrf_token);
            // Perform delete action
            fetch(`/admin/chirps/${id}`, {
                method: 'POST',
                body: formData
            })
            .then((response) => {
                if (response.ok) {
                    console.log('Chirp deleted successfully!');
                    setIsChirpDeleted(true);
                    if (trixInput.current) {
                        trixInput.current.editor.loadHTML('');
                    }
                } else {
                    console.error('Failed to delete chirp');
                }
            })
            .catch((error) => console.error('Error:', error));
        }
    };

    const [isUserActive, setIsUserActive] = useState((report.user && report.user.is_active == true) ? true : false);
    const handleIsActiveUser = (id) => {
        if (!id) {
            console.error('Invalid user ID');
            return;
        }

        // Toggle the active state locally
        const newIsActive = !isUserActive;
        setIsUserActive(newIsActive);

        // Send the request to update the user status
        fetch(`/admin/reports/update-user-status/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': props.csrf_token,
            },
            body: JSON.stringify({ is_active: newIsActive }),
        })
        .then((response) => {
            console.log(response);
            if (response.ok) {
                console.log('User status updated successfully!');
            } else {
                console.error('Failed to update user status');
                // Revert the UI change if the request failed
                setIsUserActive(!newIsActive);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            setIsUserActive(!newIsActive);
        });

    }
    return (
        <AuthenticatedLayout>
            <Head title="Detail Report" />

            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h1 className="text-xl font-semibold mb-4">Detail Report</h1>
                        <div className="my-2">
                            <div className="flex flex-row justify-between items-center">
                                <h1 className="text-lg font-semibold mb-2">User</h1>
                                <div className='flex flex-row justify-start items-center'>
                                    <div className='flex flex-col'>
                                        {report.user ? report.user.name : ''}
                                    </div>
                                    <div className='ml-4 flex flex-col'>
                                        {report.user ? report.user.email : ''}
                                    </div>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <span>Inactive </span>
                                    <div className="flex items-center">
                                        {/* Toggle switch */}
                                        <label htmlFor="toggle" className="inline-flex relative items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                id="toggle"
                                                className="sr-only"
                                                checked={isUserActive}
                                                onChange={() => handleIsActiveUser(report.user ? report.user.id : null)}
                                            />
                                            <div className={`w-10 h-4 rounded-full ${isUserActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                            <div
                                                className={`w-6 h-6 border-2 bg-white rounded-full absolute left-0 transition-all ${
                                                    isUserActive ? 'translate-x-6 bg-green-500 border-green-500' : 'translate-x-0 bg-gray-200 border-gray-400'
                                                }`}
                                            ></div>
                                        </label>
                                    </div>
                                    <span className="ml-2">Active</span>
                                </div>
                            </div>
                        </div>
                        <div className="my-2">
                            <div className="flex flex-row justify-between items-center">
                                <h1 className="text-lg font-semibold mb-2">Chrip</h1>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteChirp(report.chirp ? report.chirp.id : null)}
                                        disabled={isChirpDeleted} // Disable button if chirp is deleted
                                        className={`ml-4 px-4 py-2 rounded-md ${
                                            isChirpDeleted ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-red-500 text-white'
                                        }`}
                                    >
                                    {isChirpDeleted ? 'Chirp is Deleted' : 'Delete Chirp'}
                                    </button>
                                </div>
                            </div>
                            <div className='mt-4 flex flex-col justify-start items-start'>
                                <div className='flex flex-row justify-start items-center'>
                                    {(report.chirp ? report.chirp.image : '')  && (
                                        <img
                                            src={`/storage/${report.chirp ? report.chirp.image : ''}`}
                                            alt="Chirp"
                                            className='w-24 h-24 mr-4 cover'
                                        />
                                    )}
                                    <div className='flex justify-center flex-col'>
                                        <span id="empty-toolbar"></span>
                                        <trix-editor
                                            ref={trixInput}
                                            class="trix-editor w-full h-full border-none"
                                            readonly
                                            toolbar="empty-toolbar"
                                        />
                                    </div>
                                </div>
                                <div className="mt-1">
                                    {hashtags.map((hashtag, index) => (
                                        <span
                                            key={index}
                                            className="inline-block bg-blue-500 text-white rounded-full py-1 px-3 text-sm mr-2 mb-2"
                                        >
                                            #{hashtag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <h1 className="text-lg font-semibold mb-2">Report Notes</h1>
                        <form onSubmit={submit}>
                            <div className="mb-4 flex items-center">
                                <textarea
                                    className="w-full h-32 border-gray-300 rounded-lg focus:ring focus:ring-green-200 focus:border-green-400"
                                    placeholder="Add notes (optional)"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                ></textarea>
                                {errors.notes && (
                                    <span className="text-red-500 text-sm">{errors.notes}</span>
                                )}
                            </div>


                            {/* Is Resolved Toggle */}
                            <div className="mb-4 flex items-center">
                                <InputLabel htmlFor="is_resolved" value="Status" />
                                <button
                                    type="button"
                                    onClick={() => setData('is_resolved', !data.is_resolved)}
                                    className={`ml-4 px-4 py-2 rounded-md ${
                                        data.is_resolved
                                            ? 'bg-green-500 text-white'
                                            : 'bg-red-500 text-white'
                                    }`}
                                >
                                    {data.is_resolved ? 'Resolved' : 'Not Resolved'}
                                </button>
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
