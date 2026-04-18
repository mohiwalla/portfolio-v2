import { BrowserRouter, Route, Routes } from "react-router";
import { Suspense, lazy } from "react";
import Layout from "@/app/layout";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";

const Home = lazy(() => import("@/app/screens/home"));
const Konami = lazy(() => import("@/app/screens/konami"));
const Chess = lazy(() => import("@/app/screens/chess"));
const Terminal = lazy(() => import("@/app/screens/terminal"));

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route
                        index
                        element={
                            <Suspense fallback={<Loading />}>
                                <Home />
                            </Suspense>
                        }
                    />
                    <Route
                        path="konami"
                        element={
                            <Suspense fallback={<Loading />}>
                                <Konami />
                            </Suspense>
                        }
                    />
                    <Route
                        path="chess"
                        element={
                            <Suspense fallback={<Loading />}>
                                <Chess />
                            </Suspense>
                        }
                    />
                    <Route
                        path="terminal"
                        element={
                            <Suspense fallback={<Loading />}>
                                <Terminal />
                            </Suspense>
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
