import { useState } from "react";
import EnterGroupView from "./Group/EnterGroupView";
import CreateGroupView from "./Group/CreateGroupView";

const Home = () => {
    const [enterGroupView, setEnterGroupView] = useState<boolean>(false);
    const [createGroupView, setCreateGroupView] = useState<boolean>(false);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className={`p-5 rounded-md ${enterGroupView || createGroupView ? 'border' : 'hidden'}
                ${enterGroupView ? "border-blue-600" : ""}
                ${createGroupView ? "border-green-500" : ""}`}>
                {enterGroupView && <EnterGroupView />}
                {createGroupView && <CreateGroupView />}
            </div>
            <div className="inline-flex mt-5">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md m-2" 
                    onClick={() => {
                        setEnterGroupView(prev => !prev);
                        setCreateGroupView(false);
                    }}>
                    View Group
                </button>

                <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md m-2"
                    onClick={() => {
                        setCreateGroupView(prev => !prev);
                        setEnterGroupView(false);
                    }}>
                    Create Group
                </button>
            </div>
        </div>
    );
};

export default Home;
