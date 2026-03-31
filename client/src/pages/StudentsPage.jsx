import { useEffect, useState } from "react";

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch("/api/students");
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to load students");
                }

                setStudents(data);
            } catch (fetchError) {
                setError(fetchError.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, []);

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc,_#e0f2fe)] px-4 py-10">
            <div className="mx-auto max-w-5xl">
                <section className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
                    <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-1 text-sm tracking-[0.2em] text-sky-200 uppercase">
                        Student Directory
                    </p>
                    <h1 className="text-4xl font-bold">All Saved Students</h1>
                    <p className="mt-3 text-slate-300">
                        Students are loaded from the{" "}
                        <span className="font-semibold text-white">universityDB.student</span>
                        {" "}collection.
                    </p>
                </section>

                <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                    {isLoading ? (
                        <p className="text-slate-600">Loading students...</p>
                    ) : null}

                    {error ? (
                        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </p>
                    ) : null}

                    {!isLoading && !error && students.length === 0 ? (
                        <p className="text-slate-600">
                            No students found yet. Add one from the form page.
                        </p>
                    ) : null}

                    {!isLoading && !error && students.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {students.map((student) => (
                                <article
                                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                                    key={student._id}
                                >
                                    <h2 className="text-2xl font-semibold text-slate-900">
                                        {student.name}
                                    </h2>
                                    <div className="mt-4 space-y-2 text-sm text-slate-700">
                                        <p>
                                            <span className="font-semibold">Age:</span>{" "}
                                            {student.age}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Department:</span>{" "}
                                            {student.dep}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Country:</span>{" "}
                                            {student.country}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : null}
                </section>
            </div>
        </div>
    );
}
