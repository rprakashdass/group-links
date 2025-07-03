import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SERVER_URL from "../../config/api";
import useUser from "../../hooks/useUser";

const EnterGroupView = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const groupUrlRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const userId = user?.id;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const groupUrl = groupUrlRef?.current?.value?.trim();

        if (!groupUrl) {
            alert("Please enter a valid group URL.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.get(`${SERVER_URL}/groups/exists/${groupUrl}`);

            if (response.status === 200) {
                const groupId = response?.data?._id;
                if (userId) {
                    try {
                        await axios.post(`${SERVER_URL}/groups/${userId}/visit/${groupId}`);
                    } catch (err) {
                        // If already joined, ignore error and proceed
                        if (axios.isAxiosError(err) && err.response && err.response.status !== 404) {
                            alert('Failed to join group.');
                            setLoading(false);
                            return;
                        }
                    }
                }
                navigate(`/groups/${groupUrl}`);
            } else {
                alert("Group does not exist. Please check the URL.");
            }
        } catch (error) {
            console.error("Error checking group existence:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Join a Group</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label htmlFor="groupUrl" className="text-sm font-medium text-gray-700">
                        Group URL
                    </label>
                    <input
                        ref={groupUrlRef}
                        type="text"
                        name="groupUrl"
                        placeholder="Enter group URL (e.g. ai-project-team)"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-4 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white font-semibold py-2 rounded-lg transition-all duration-200`}
                    >
                        {loading ? "Entering..." : "Enter Group"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EnterGroupView;