import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function CreateReportModal({ isOpen, onClose, userId, chirpId }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        user_id: userId || null,
        chirp_id: chirpId || null,
        notes: '',
        is_resolved: false,
    });

    // Update the form data when userId or chirpId changes
    useEffect(() => {
        if (userId && chirpId) {
            setData({
                user_id: userId,
                chirp_id: chirpId,
                notes: data.notes,
                is_resolved: data.is_resolved,
            });
        }
    }, [userId, chirpId]); // Trigger on userId or chirpId changes

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data before submitting:', data);  // Check the data before submission
        post(route('admin.reports.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center border-b pb-3">
                    <div>
                        <span className="text-lg font-semibold text-gray-800">Create New Report</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none text-xl"
                        aria-label="Close Modal"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 flex flex-col">
                    <textarea
                        className="w-full h-32 border-gray-300 rounded-lg focus:ring focus:ring-green-200 focus:border-green-400"
                        placeholder="Add notes (optional)"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                    ></textarea>
                    {errors.notes && (
                        <span className="text-red-500 text-sm">{errors.notes}</span>
                    )}

                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            id="is_resolved"
                            checked={data.is_resolved}
                            onChange={(e) => setData('is_resolved', e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="is_resolved" className="text-sm text-gray-700">
                            Mark as resolved
                        </label>
                    </div>

                    <div className="mt-6 text-right space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none"
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

