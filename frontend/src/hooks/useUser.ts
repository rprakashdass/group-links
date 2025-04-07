import { useState, useEffect } from 'react';
import SERVER_URL from '../../config/api';

interface User {
    id: string; // User ID for backend operations
    username: string;
    email: string;
    groupsCreated: string[]; // Array of group IDs created by the user
    groupsVisited: string[]; // Array of group IDs visited by the user
    createdAt: string; // Timestamp of user creation
    updatedAt: string; // Timestamp of last update
}

const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token'); // Retrieve the token from localStorage
                if (!token) {
                    setUser(null); // If no token, set user to null
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${SERVER_URL}/auth/me`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }

                // Parse the response as JSON
                const data = await response.json();
                const userData: User = {
                    id: data._id,
                    username: data.username,
                    email: data.email,
                    groupsCreated: data.groupsCreated,
                    groupsVisited: data.groupsVisited,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                };

                setUser(userData); // Set the user data
            } catch (error) {
                console.error('Error fetching user:', error);
                setUser(null); // Set user to null on error
            } finally {
                setLoading(false); // Set loading to false after the operation
            }
        };

        fetchUser();
    }, []);

    return { user, loading };
};

export default useUser;