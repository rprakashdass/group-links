import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/userContext";
import Home from "./Pages/Home";
import GroupView from "./Pages/Group/GroupView";
import CreateGroupView from "./Pages/Group/CreateGroupView";
import EnterGroupView from "./Pages/Group/EnterGroupView";
import Register from "./Pages/User/Register";
import Login from "./Pages/User/Login";
import Dashboard from "./Pages/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <UserProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/create-group" element={<CreateGroupView />} />
                    <Route path="/enter-group" element={<EnterGroupView />} />
                    <Route path="/groups/:groupUrl" element={<GroupView />} />
                </Routes>
            </UserProvider>
        </BrowserRouter>
    );
}

export default App;