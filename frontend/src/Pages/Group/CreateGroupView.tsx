

const CreateGroupView = () => {
    return (
        <div className="">
            <div className="flex flex-col justify-center items-center">
                <form className="flex flex-col gap-5">
                    <label htmlFor="groupName">Enter the group name</label>
                    <input type="text" name="groupName" className="border border-green-500 rounded-md"></input>
                    <button type="submit" className="bg-green-500 rounded-md p-3">Create Group</button>
                </form>
            </div>
        </div>
    )
}
export default CreateGroupView;