import { useState } from "react";
import EnterGroupView from "./Group/EnterGroupView";
import CreateGroupView from "./Group/CreateGroupView";

const Home = () => {
    const [enterGroupView, setEnterGroupView] = useState<boolean>(false);
    const [createGroupView, setCreateGroupView] = useState<boolean>(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {/* Container for the active view */}
            <div
                className={`w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
                    enterGroupView || createGroupView ? "opacity-100 scale-100" : "opacity-0 scale-95 hidden"
                } ${enterGroupView ? "border-l-4 border-blue-600" : ""} ${
                    createGroupView ? "border-l-4 border-green-500" : ""
                }`}
            >
                {enterGroupView && <EnterGroupView />}
                {createGroupView && <CreateGroupView />}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                    className="relative bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:scale-105 transform transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={() => {
                        setEnterGroupView((prev) => !prev);
                        setCreateGroupView(false);
                    }}
                >
                    {enterGroupView ? "Close" : "View Group"}
                    <span className="absolute inset-0 rounded-lg bg-blue-800 opacity-0 hover:opacity-20 transition-opacity duration-200"></span>
                </button>

                <button
                    className="relative bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 hover:scale-105 transform transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400"
                    onClick={() => {
                        setCreateGroupView((prev) => !prev);
                        setEnterGroupView(false);
                    }}
                >
                    {createGroupView ? "Close" : "Create Group"}
                    <span className="absolute inset-0 rounded-lg bg-green-800 opacity-0 hover:opacity-20 transition-opacity duration-200"></span>
                </button>
            </div>

            {/* Welcome Text */}
            <p className="mt-6 text-gray-500 text-sm">
                {enterGroupView || createGroupView ? "" : "Welcome! Choose an option to get started."}
            </p>
        </div>
    );
};

export default Home;