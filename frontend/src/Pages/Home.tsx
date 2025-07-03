import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import axios from "axios";
import SERVER_URL from "../config/api";
import CreateGroupView from "./Group/CreateGroupView";
import EnterGroupView from "./Group/EnterGroupView";
import { FiMenu, FiX, FiUsers, FiPlusCircle, FiLogOut, FiSearch, FiUserPlus } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

type GroupType = {
    _id: string;
    name: string;
    groupUrl: string;
    admin?: string;
};

const Home: React.FC = () => {
    const { user, loading } = useUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"groups" | "join" | "create">("groups");
    const [groups, setGroups] = useState<GroupType[]>([]);
    const [loadingGroups, setLoadingGroups] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!loading && !user) {
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
                    navigate("/login");
                    return;
                }
                const [joinedRes, createdRes] = await Promise.all([
                    axios.get(`${SERVER_URL}/groups/visited/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${SERVER_URL}/groups/created/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);


                let allGroups = [...joinedRes.data, ...createdRes.data];

                // Deduplicate by _id
                const seen = new Set();
                allGroups = allGroups.filter(g => {
                    if (seen.has(g._id)) return false;
                    seen.add(g._id);
                    return true;
                });
                setGroups(allGroups);
            } catch (err) {
                console.error("Error fetching groups:", err);
                setError("Failed to load groups. Please try again.");
            } finally {
                setLoadingGroups(false);
            }
        };
        fetchGroups();
    }, [user, navigate]);

    const filteredGroups = groups.filter(group => group.name.toLowerCase().includes(search.toLowerCase()));

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-lg text-gray-600">Loading...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex h-screen flex-col md:flex-row font-sans">
            {/* Mobile Top Bar */}
            <div className="md:hidden flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-3 shadow">
                <div className="flex items-center gap-2">
                    <FaUserCircle size={28} />
                    <h1 className="text-lg font-semibold text-ellipsis">Hello, {user.username}</h1>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`relative bg-gradient-to-b from-blue-600 to-blue-400 shadow-md md:static w-full md:w-1/4 text-white h-full md:h-screen ${
                    isSidebarOpen ? "block" : "hidden md:block"
                }`}
            >
                <div className="p-6 flex flex-col items-center gap-2 border-b border-blue-300">
                    <FaUserCircle size={48} className="mb-2" />
                    <h1 className="text-xl font-bold">Welcome, {user.username}!</h1>
                    <p className="text-sm text-blue-100">{user.email}</p>
                    <button
                        onClick={handleLogout}
                        className="mt-2 flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm"
                    >
                        <FiLogOut /> Logout
                    </button>
                </div>
                <div className="flex flex-col mt-2 divide-y divide-blue-300">
                    {["groups", "join", "create"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab as typeof activeTab);
                                setIsSidebarOpen(false);
                            }}
                            className={`px-4 py-3 text-left flex items-center gap-2 transition-all text-white ${
                                activeTab === tab
                                    ? "bg-white/20 border-l-4 border-yellow-300 font-bold"
                                    : "hover:bg-white/10"
                            }`}
                        >
                            {tab === "groups" && <FiUsers />}
                            {tab === "join" && <FiUserPlus />}
                            {tab === "create" && <FiPlusCircle />}
                            {tab === "groups"
                                ? "Groups"
                                : tab === "join"
                                ? "Join Group"
                                : "Create Group"}
                        </button>
                    ))}
                </div>
                {activeTab === "create" && (
                    <button
                        onClick={() => setActiveTab("create")}
                        className="m-4 w-[90%] flex items-center justify-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold rounded shadow transition-all"
                    >
                        <FiPlusCircle /> Create Group
                    </button>
                )}
                <div className="absolute bottom-0 left-0 w-full md:w-1/4 p-4 text-xs text-blue-100 bg-blue-700/80 flex flex-col items-center gap-1">
                    <span>Made by
                        <a href="https://www.rprakashdass.in" target="_blank" rel="noopener noreferrer" className="underline ml-1 hover:text-yellow-200">Prakash Dass R</a>
                        {" "} and 
                        <a href="https://siranjeevik.vercel.app" target="_blank" rel="noopener noreferrer" className="underline ml-1 hover:text-yellow-200">Siranjeevi K</a>
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
                {/* Search bar for groups */}
                {(activeTab === "groups") && (
                    <div className="flex items-center gap-2 mb-6">
                        <div className="relative w-full max-w-md">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search groups..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
                            />
                        </div>
                    </div>
                )}
                {/* Main content logic */}
                {activeTab === "join" ? (
                    <div className="w-full flex justify-center items-center">
                        <EnterGroupView />
                    </div>
                ) : activeTab === "create" ? (
                    <div className="w-full flex justify-center items-center">
                        <CreateGroupView />
                    </div>
                ) : loadingGroups ? (
                    <div className="flex flex-col items-center justify-center mt-12">
                        <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                        <p className="text-center text-gray-600">Loading groups...</p>
                    </div>
                ) : error ? (
                    <p className="text-center text-red-600">{error}</p>
                ) : filteredGroups.length > 0 ? (
                    <>
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">Your Groups</h2>
                        <ul className="w-full mt-8 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGroups.map((group) => (
                                <Link to={`/groups/${group.groupUrl}`} key={group._id}>
                                    <li className="p-6 bg-white rounded-xl shadow hover:bg-blue-50 cursor-pointer transition-all duration-200 flex flex-col gap-2 items-start">
                                        <div className="flex items-center gap-3 mb-2">
                                            <FiUsers className="text-blue-400" size={24} />
                                            <span className="font-semibold text-lg text-blue-800">{group.name}</span>
                                            {user && group.admin && group.admin === user.id && (
                                                <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full font-medium">Created by you</span>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-500">/groups/{group.groupUrl}</span>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center mt-16">
                        <svg width="120" height="120" fill="none" viewBox="0 0 24 24" className="mb-4 text-blue-200"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#e0e7ff" /><path d="M8 12h8M12 8v8" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" /></svg>
                        <p className="text-center text-gray-600 mt-4">404 Not Found: You have not joined or created any groups yet.</p>
                        <button
                            onClick={() => setActiveTab("join")}
                            className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded shadow"
                        >
                            <FiUserPlus className="inline mr-2" /> Join a Group
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;