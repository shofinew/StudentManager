import { Link, Route, Routes } from "react-router-dom";

import StudentFormPage from "./pages/StudentFormPage.jsx";
import StudentsPage from "./pages/StudentsPage.jsx";

export default function App() {
    return (
        <div>
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
                    <Link className="text-xl font-bold text-slate-900" to="/">
                        Student Manager
                    </Link>

                    <nav className="flex gap-3 text-sm font-medium">
                        <Link
                            className="rounded-full border border-slate-300 px-4 py-2 text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                            to="/add-student"
                        >
                            Add Student
                        </Link>
                        <Link
                            className="rounded-full border border-slate-300 px-4 py-2 text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                            to="/students"
                        >
                            View Students
                        </Link>
                    </nav>
                </div>
            </header>

            <Routes>
                <Route element={<StudentFormPage />} path="/" />
                <Route element={<StudentFormPage />} path="/add-student" />
                <Route element={<StudentsPage />} path="/students" />
            </Routes>
        </div>
    );
}
