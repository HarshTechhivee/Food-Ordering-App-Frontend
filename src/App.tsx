import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { socket } from "./services/socket.js";
import AppRoutes from "./routes/AppRoutes";
import AuthInitializer from "./components/common/AuthInitializer";
import SocketListener from "./components/common/SocketListener.js";

import './App.css'

function App() {

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            return;
        }

        socket.auth = { token, };

        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <BrowserRouter>
            <SocketListener />

            <AuthInitializer />

            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;