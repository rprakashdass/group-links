import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SERVER_URL from "../../../config/api";

const EnterGroupView = () => {
    const navigate = useNavigate();
    const groupUrlRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const groupUrl = groupUrlRef?.current?.value;

        if (!groupUrl) {
            alert("Please enter a valid group URL.");
            return;
        }

        try {
            // Check if the group exists
            const response = await axios.get(`${SERVER_URL}/groups/exists/${groupUrl}`);
            if (response.data) {
                navigate(`${SERVER_URL}/groups/${groupUrl}`);
            } else {
                alert("Group does not exist. Please check the URL.");
            }
        } catch (error) {
            console.error("Error checking group existence:", error);
            alert("An error occurred while checking the group. Please try again.");
        }
    };

    return (
        <div className="enter-group-container">
            <div className="flex flex-col justify-center items-center">
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <label htmlFor="groupUrl">Enter the group URL</label>
                    <input
                        ref={groupUrlRef}
                        type="text"
                        name="groupUrl"
                        className="rounded-md border border-blue-600"
                        required
                    />
                    <button type="submit" className="bg-blue-600 rounded-md p-3 text-white">
                        View Group
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EnterGroupView;