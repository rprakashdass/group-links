import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import axios from "axios";
import SERVER_URL from "../../config/api";
import CreateGroupView from "./Group/CreateGroupView";
import EnterGroupView from "./Group/EnterGroupView";
import GroupView from "./Group/GroupView";
import { FiMenu, FiX } from 'react-icons/fi';

type GroupType = {
    _id: string;
    name: string;
    groupUrl: string;
};

const Home: React.FC = () => {
    const { user, loading } = useUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"joined" | "created" | "join" | "create" | "groupView">("joined");
    const [groups, setGroups] = useState<GroupType[]>([]);
    const [loadingGroups, setLoadingGroups] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGroupUrl, setSelectedGroupUrl] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [loading, user, navigate]);

    useEffect(() => {
        const fetchGroups = async () => {
            if (!user || (activeTab !== "joined" && activeTab !== "created")) return;

            setLoadingGroups(true);
            setError(null);

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
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
        setSelectedGroupUrl(groupUrl);
        setActiveTab("groupView");
    };

    const renderContent = () => {
        if (activeTab === "join") {
            return <EnterGroupView />;
        }

        if (activeTab === "create") {
            return <CreateGroupView />;
        }

        if (activeTab === "groupView" && selectedGroupUrl) {
            return <GroupView/>;
        }

        if (loadingGroups) {
            return <p className="text-center text-gray-600">Loading groups...</p>;
        }

        if (error) {
            return <p className="text-center text-red-600">{error}</p>;
        }

        if (groups.length > 0) {
            return (
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
            );
        }

        return (
            <p className="text-center text-gray-600">
                {activeTab === "joined"
                    ? "You haven't joined any groups yet."
                    : "You haven't created any groups yet."}
            </p>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-lg text-gray-600">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }
    return (
        <div className="flex h-screen flex-col md:flex-row">
            {/* Mobile Top Bar */}
            <div className="md:hidden flex justify-between items-center bg-blue-600 text-white px-4 py-3">
                <div>
                    <h1 className="text-lg font-bold">Welcome, {user.username}!</h1>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`bg-white shadow-md md:static md:block w-full md:w-1/4 ${
                    isSidebarOpen ? 'block' : 'hidden'
                }`}
            >
                <div className="p-4 bg-blue-600 text-white hidden md:block">
                    <h1 className="text-xl font-bold">Welcome, {user.username}!</h1>
                    <p className="text-sm">{user.email}</p>
                </div>
                <div className="flex flex-col mt-4">
                    {["joined", "created", "join", "create"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab as typeof activeTab);
                                setIsSidebarOpen(false); // close sidebar on mobile after click
                            }}
                            className={`p-4 text-left ${
                                activeTab === tab ? "bg-blue-100 font-bold" : "hover:bg-gray-100"
                            }`}
                        >
                            {tab === "joined"
                                ? "Joined Groups"
                                : tab === "created"
                                ? "Created Groups"
                                : tab === "join"
                                ? "Join Group"
                                : "Create Group"}
                        </button>
                    ))}
                </div>
            </div>
            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">{renderContent()}</div>
        </div>
    );
};

export default Home;