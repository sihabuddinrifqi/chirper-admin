import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useRef, useState } from "react";
import ChirpModal from '@/Components/ChirpModal';
import CreateReportModal from '@/Components/CreateReportModal';

export default function Index({ user, title, chirps }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this chrip?')) {
            destroy(route('admin.chirps.destroy', id));
        }
    };


    const truncateHtml = (htmlString, maxLength) => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlString;

        // Ambil teks murni dan ganti enter dengan spasi
        const textContent = (tempElement.textContent || tempElement.innerText || '').replace(/\n|\r\n|\t/g, " ");

        const truncatedText = textContent.length > maxLength
            ? `${textContent.substring(0, maxLength)}...`
            : textContent;

        return truncatedText;
    };


    const [isModalOpen, setModalOpen] = useState(false);
    const selectedChirpRef = useRef(null); // Use a ref for the selected chirp

    const openModal = (chirp) => {
        selectedChirpRef.current = chirp; // Set the selected chirp in the ref
        setModalOpen(true); // Open the modal
    };

    const closeModal = () => {
        setModalOpen(false); // Close the modal
        selectedChirpRef.current = null; // Clear the selected chirp
    };

    const [isCreateReportModalOpen, setCreateReportModalOpen] = useState(false);
    const userIdRef = useRef(null);
    const chirpIdRef = useRef(null);

    const openCreateReportModal = (userId, chirpId) => {
        userIdRef.current = userId;
        chirpIdRef.current = chirpId;
        setCreateReportModalOpen(true);
    };

    const closeCreateReportModal = () => {
        userIdRef.current = null;
        chirpIdRef.current = null;

        setCreateReportModalOpen(false);
    };


    return (
        <AuthenticatedLayout>
            <Head title={title} />

            {/* Chirp Modal */}
            {selectedChirpRef && (
                <ChirpModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    chirp={selectedChirpRef.current}
                />
            )}

            {userIdRef && chirpIdRef && (
                <CreateReportModal
                    isOpen={isCreateReportModalOpen}
                    onClose={closeCreateReportModal}
                    userId ={userIdRef.current}
                    chirpId ={chirpIdRef.current}
                />
            )}
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h1 className="text-xl font-semibold mb-4">Chirps Management</h1>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">User Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Chirp</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Created At</th>
                                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {chirps.map((chirp) => (
                                    <tr key={chirp.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{chirp.user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"><span>{ truncateHtml(chirp.message, 40) }</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {
                                                new Date(chirp.created_at).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                                })
                                            }
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => openModal(chirp)}
                                                className="text-green-600 hover:text-green-900 mr-2"
                                            >
                                                Detail
                                            </button>
                                            <button
                                                onClick={() => openCreateReportModal(user.id, chirp.id)}
                                                className="text-yellow-600 hover:text-yellow-900 mr-2"
                                            >
                                                Report
                                            </button>
                                            <button
                                                onClick={() => handleDelete(chirp.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {chirps.length === 0 && (
                            <p className="text-gray-500 mt-4">No chirps found.</p>
                        )}
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
