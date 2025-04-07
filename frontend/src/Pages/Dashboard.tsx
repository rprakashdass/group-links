import React, { useEffect, useState } from "react";
import axios from "axios";
import SERVER_URL from "../../config/api";
import { useNavigate } from "react-router-dom";

type GroupType = {
    _id: string;
    name: string;
    groupUrl: string;
};

const Dashboard: React.FC = () => {
    const [user, setUser] = useState<{ username: string; email: string } | null>(null);
    const [groupsCreated, setGroupsCreated] = useState<GroupType[]>([]);
    const [groupsParticipated, setGroupsParticipated] = useState<GroupType[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login"); // Redirect to login if no token is found
                    return;
                }

                // Fetch user details
                const userResponse = await axios.get(`${SERVER_URL}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (userResponse.status === 200) {
                    setUser(userResponse.data);
                }

                // Fetch groups created by the user
                const createdGroupsResponse = await axios.get(`${SERVER_URL}/users/${userResponse.data._id}/groups-created`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (createdGroupsResponse.status === 200) {
                    setGroupsCreated(createdGroupsResponse.data);
                }

                // Fetch groups participated by the user
                const participatedGroupsResponse = await axios.get(`${SERVER_URL}/users/${userResponse.data._id}/groups-visited`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (participatedGroupsResponse.status === 200) {
                    setGroupsParticipated(participatedGroupsResponse.data);
                }
            } catch (err: unknown) {
                console.error("Error fetching user data:", err);
                setError("Failed to fetch user data. Please log in again.");
                localStorage.removeItem("token"); // Clear invalid token
                navigate("/login"); // Redirect to login
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token from localStorage
        navigate("/login"); // Redirect to login
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container flex flex-col bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 shadow-md">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">Welcome, {user?.username || "User"}!</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
                <p className="text-sm">Email: {user?.email || "N/A"}</p>
            </div>

            {/* Groups Section */}
            <div className="flex flex-col md:flex-row gap-6 p-6">
                {/* Groups Created */}
                <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Groups Created</h2>
                    {groupsCreated.length > 0 ? (
                        <ul className="space-y-4">
                            {groupsCreated.map((group) => (
                                <li key={group._id} className="p-4 bg-gray-100 rounded-md shadow">
                                    <p className="font-medium">{group.name}</p>
                                    <a
                                        href={`/groups/${group.groupUrl}`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Visit Group
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">You haven't created any groups yet.</p>
                    )}
                </div>

                {/* Groups Participated */}
                <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Groups Participated</h2>
                    {groupsParticipated.length > 0 ? (
                        <ul className="space-y-4">
                            {groupsParticipated.map((group) => (
                                <li key={group._id} className="p-4 bg-gray-100 rounded-md shadow">
                                    <p className="font-medium">{group.name}</p>
                                    <a
                                        href={`/groups/${group.groupUrl}`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Visit Group
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">You haven't participated in any groups yet.</p>
                    )}
                </div>
            </div>

            {/* History Section */}
            <div className="bg-white p-4 rounded-lg shadow-md mx-6">
                <h2 className="text-lg font-semibold mb-4">History</h2>
                <p className="text-gray-600">Feature coming soon...</p>
            </div>
        </div>
    );
};

export default Dashboard;