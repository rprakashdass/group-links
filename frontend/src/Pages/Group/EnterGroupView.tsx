import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const EnterGroupView = () => {
    const navigate = useNavigate();
    const groupUrlRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const groupUrl = groupUrlRef?.current?.value;
        if(groupUrl){
            navigate(`/group/${groupUrl}`);
        } else {
            console.error("groupUrl is invalid");
        }
    }

    return (
        <div className="">
            <div className="flex flex-col justify-center items-center">
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <label htmlFor="groupName">Enter the group url</label>
                    <input ref={groupUrlRef} type="text" name="groupUrl" className="rounded-md border border-blue-600"></input>
                    <button type="submit" className="bg-blue-600 rounded-md p-3">View Group</button>
                </form>
            </div>
        </div>
    )
}

export default EnterGroupView;