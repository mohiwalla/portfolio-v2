import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/app/global.css";
import AppRouter from "@/app/router";

document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppRouter />
    </StrictMode>
);
