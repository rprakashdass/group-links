import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";

interface Group {
    _id: string;
    name: string;
    groupUrl: string;
    description?: string;
}

const JoinedGroups: React.FC = () => {
    const { user } = useUser();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroups = async () => {
            if (!user?.id) return;
            try {
                const response = await axios.get(`${API_BASE_URL}/users/${user.id}/groups`);
                setGroups(response.data.groups);
            } catch (err) {
                setError("Failed to fetch groups.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [user?.id]);

    const handleGroupClick = (groupUrl: string) => {
        navigate(`/groups/${groupUrl}`);
    };

    if (loading) return <p className="text-center mt-6">Loading groups...</p>;
    if (error) return <p className="text-center text-red-600 mt-6">{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Your Joined Groups</h2>
            {groups.length === 0 ? (
                <p>You haven’t joined any groups yet.</p>
            ) : (
                <ul className="space-y-4">
                    {groups.map((group) => (
                        <li
                            key={group._id}
                            onClick={() => handleGroupClick(group.groupUrl)}
                            className="cursor-pointer bg-white shadow-md p-4 rounded-lg hover:bg-blue-50 transition"
                        >
                            <h3 className="text-lg font-semibold">{group.name}</h3>
                            {group.description && <p className="text-sm text-gray-600">{group.description}</p>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default JoinedGroups;