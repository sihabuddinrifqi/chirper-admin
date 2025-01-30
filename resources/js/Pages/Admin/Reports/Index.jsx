import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useRef, useState } from "react";

export default function Index({ auth, title, reports }) {
    console.log(reports);
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this reports?')) {
            destroy(route('admin.reports.destroy', id));
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

    return (
        <AuthenticatedLayout>
            <Head title={title} />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h1 className="text-xl font-semibold mb-4">Reports Management</h1>
                        <div class="overflow-x-scroll">
                            <table className="min-w-full divide-y divide-gray-200 table-auto">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Reporter</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Chirp</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Notes</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reports.map((report) => (
                                        <tr key={report.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.user ? report.user.name : '>user missing or deleted<'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"><span>{ truncateHtml(report.chirp ? report.chirp.message : '>chrip missing or deleted<', 40) }</span></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.notes ? report.notes : ''}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {report.is_resolved
                                                    ? (<span className="text-sm text-green-600">Resolved</span>)
                                                    : (<span className="text-sm text-red-600">Not Resolved</span>)
                                                }
                                            </td>
                                            <td>
                                                <Link
                                                    href={route('admin.reports.edit', report.id)}
                                                    className="text-yellow-600 hover:text-yellow-900 mr-2"
                                                >
                                                    Detail
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(report.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {reports.length === 0 && (
                            <p className="text-gray-500 mt-4">No chirps found.</p>
                        )}
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
