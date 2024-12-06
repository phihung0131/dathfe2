import { useEffect, useState } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
    useEffect(() => {
        document.title = "Đóm store"
    });
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
}

export default App;
