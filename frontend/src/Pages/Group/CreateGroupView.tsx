import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import SERVER_URL from "../../config/api";
import useUser from "../../hooks/useUser";

const CreateGroupView: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const nameRef = useRef<HTMLInputElement>(null);
    const groupUrlRef = useRef<HTMLInputElement>(null);
    const adminOnlyChatRef = useRef<HTMLInputElement>(null);
    const autoDeleteAfterRef = useRef<HTMLInputElement>(null);
    const [groupType, setGroupType] = useState<string>("strict");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const name = nameRef?.current?.value;
        const groupUrl = groupUrlRef?.current?.value;
        const adminOnlyChat = adminOnlyChatRef.current?.checked || false;
        const autoDeleteAfter = autoDeleteAfterRef?.current?.value
            ? parseInt(autoDeleteAfterRef.current.value, 10)
            : null;

        if (!name || !groupUrl) {
            alert("Both fields are required");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You must be logged in to create a group.");
                navigate("/login");
                return;
            }

            const response = await axios.post(
                `${SERVER_URL}/groups/create-group`,
                {
                    name,
                    groupUrl,
                    adminId: user?.id,
                    adminOnlyChat,
                    autoDeleteAfter,
                    groupType,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                alert("Group created successfully!");
                navigate(`/groups/${groupUrl}`);
            }
        } catch (err) {
            console.error("Error creating group:", err);
            if (err instanceof AxiosError) {
                alert(err.response?.data.message);
            } else {
                alert("Failed to create group. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-xl font-bold mb-4">Create a New Group</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Group Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            ref={nameRef}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="groupUrl" className="block text-sm font-medium text-gray-700">
                            Group URL
                        </label>
                        <input
                            type="text"
                            id="groupUrl"
                            ref={groupUrlRef}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="adminOnlyChat" className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                ref={adminOnlyChatRef}
                                id="adminOnlyChat"
                                className="h-4 w-4"
                            />
                            Admin Only Chat
                        </label>
                    </div>
                    <div>
                        <label htmlFor="autoDeleteAfter" className="block text-sm font-medium text-gray-700">
                            Auto Delete After (in hours)
                        </label>
                        <input
                            type="number"
                            id="autoDeleteAfter"
                            ref={autoDeleteAfterRef}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter hours (optional)"
                        />
                    </div>
                    <div>
                        <label htmlFor="groupType" className="block text-sm font-medium text-gray-700">
                            Group Type
                        </label>
                        <select
                            id="groupType"
                            value={groupType}
                            onChange={(e) => setGroupType(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="strict">Strict (requires registration)</option>
                            <option value="link-only">Link-Only (no registration required)</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Group"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupView;