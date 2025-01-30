import React, { useState, useEffect, useRef } from 'react';
import Dropdown from '@/Components/Dropdown';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useForm, usePage } from '@inertiajs/react';
import TextEditor from "@/Components/TextEditor";

export default function ChirpModal({isOpen, onClose, chirp }) {
    if (!isOpen) return null;

    const hashtags = chirp.hashtags ? chirp.hashtags.split('|') : [];

    const editorRef = useRef(null); // Create a ref for the trix-editor

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.editor.loadHTML(chirp.message); // Set the content dynamically
        }
    }, [chirp.message]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center border-b pb-3">
                    <div>
                        <span className="text-lg font-semibold text-gray-800">{chirp.user.name}</span>
                        <small className="ml-2 text-sm text-gray-600">
                            {new Date(chirp.created_at).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </small>
                        {chirp.created_at !== chirp.updated_at && (
                            <small className="ml-2 text-sm text-gray-600"> &middot; edited</small>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none text-xl"
                        aria-label="Close Modal"
                    >
                        ✕
                    </button>
                </div>

                <div className="mt-4 flex flex-col">
                    <div className="flex flex-row items-start">
                        {chirp.image && (
                            <img
                                src={`/storage/${chirp.image}`}
                                alt="Chirp"
                                className="w-24 h-24 mr-4 rounded object-cover"
                            />
                        )}
                        <div className="flex-1">
                            <span id="empty-toolbar"></span>
                            <trix-editor
                                ref={editorRef}
                                className="trix-editor w-full border-none bg-gray-50 rounded p-2"
                                readOnly
                                toolbar="empty-toolbar"
                            />
                        </div>
                    </div>

                    {hashtags.length > 0 && (
                        <div className="mt-4">
                            {hashtags.map((hashtag, index) => (
                                <span
                                    key={index}
                                    className="inline-block bg-blue-500 text-white rounded-full py-1 px-3 text-sm mr-2 mb-2"
                                >
                                    #{hashtag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-6 text-right">
                    <button
                        onClick={onClose}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
