import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import axios from "axios";
import SERVER_URL from "../../config/api";

type GroupType = {
    _id: string;
    name: string;
    groupUrl: string;
};

const Home: React.FC = () => {
    const { user, loading } = useUser(); // Get the user and loading state from the hook
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"joined" | "created">("joined");
    const [groups, setGroups] = useState<GroupType[]>([]);
    const [loadingGroups, setLoadingGroups] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            // Redirect to login if not loading and user is null
            navigate("/login");
        }
    }, [loading, user, navigate]);

    useEffect(() => {
        const fetchGroups = async () => {
            if (!user) return;

            setLoadingGroups(true);
            setError(null);

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login"); // Redirect to login if no token is found
                    return;
                }

                let endpoint = "";
                if (activeTab === "joined") {
                    endpoint = `${SERVER_URL}/groups/visited/${user.id}`;
                } else if (activeTab === "created") {
                    endpoint = `${SERVER_URL}/groups/created/${user.id}`;
                }

                const response = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setGroups(response.data);
                }
            } catch (err) {
                console.error("Error fetching groups:", err);
                setError("Failed to load groups. Please try again.");
            } finally {
                setLoadingGroups(false);
            }
        };

        fetchGroups();
    }, [activeTab, user, navigate]);

    const handleGroupClick = (groupUrl: string) => {
        navigate(`/groups/${groupUrl}`);
    };

    const handleCreateGroup = () => {
        navigate("/create-group");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-lg text-gray-600">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null; // Prevent rendering if user is null (redirect will handle it)
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/4 bg-white shadow-md flex flex-col">
                <div className="p-4 bg-blue-600 text-white">
                    <h1 className="text-xl font-bold">Welcome, {user.username}!</h1>
                    <p className="text-sm">{user.email}</p>
                </div>
                <div className="flex flex-col mt-4">
                    <button
                        onClick={() => setActiveTab("joined")}
                        className={`p-4 text-left ${
                            activeTab === "joined" ? "bg-blue-100 font-bold" : "hover:bg-gray-100"
                        }`}
                    >
                        Joined Groups
                    </button>
                    <button
                        onClick={() => setActiveTab("created")}
                        className={`p-4 text-left ${
                            activeTab === "created" ? "bg-blue-100 font-bold" : "hover:bg-gray-100"
                        }`}
                    >
                        Created Groups
                    </button>
                    <button
                        onClick={handleCreateGroup}
                        className="p-4 text-left hover:bg-gray-100"
                    >
                        + Create Group
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
                {loadingGroups ? (
                    <p className="text-center text-gray-600">Loading groups...</p>
                ) : error ? (
                    <p className="text-center text-red-600">{error}</p>
                ) : groups.length > 0 ? (
                    <ul className="space-y-4">
                        {groups.map((group) => (
                            <li
                                key={group._id}
                                className="p-4 bg-white rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleGroupClick(group.groupUrl)}
                            >
                                <p className="font-medium text-lg">{group.name}</p>
                                <p className="text-sm text-gray-500">/groups/{group.groupUrl}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-600">
                        {activeTab === "joined"
                            ? "You haven't joined any groups yet."
                            : "You haven't created any groups yet."}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Home;