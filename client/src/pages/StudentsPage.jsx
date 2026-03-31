import { useEffect, useState } from "react";

const createFormState = (student) => ({
    name: student.name,
    age: String(student.age),
    dep: student.dep,
    country: student.country,
});

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingStudentId, setEditingStudentId] = useState("");
    const [editForm, setEditForm] = useState({
        name: "",
        age: "",
        dep: "",
        country: "",
    });
    const [actionStatus, setActionStatus] = useState({ type: "", message: "" });
    const [savingStudentId, setSavingStudentId] = useState("");
    const [deletingStudentId, setDeletingStudentId] = useState("");
    const [hoveredButton, setHoveredButton] = useState("");

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

    const startEditing = (student) => {
        setEditingStudentId(student._id);
        setEditForm(createFormState(student));
        setActionStatus({ type: "", message: "" });
    };

    const cancelEditing = () => {
        setEditingStudentId("");
        setEditForm({
            name: "",
            age: "",
            dep: "",
            country: "",
        });
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleUpdate = async (studentId) => {
        setSavingStudentId(studentId);
        setActionStatus({ type: "", message: "" });

        try {
            const response = await fetch(`/api/students/${studentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...editForm,
                    age: Number(editForm.age),
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update student");
            }

            setStudents((current) =>
                current.map((student) =>
                    student._id === studentId ? data.student : student
                )
            );
            setActionStatus({
                type: "success",
                message: `${data.student.name} updated successfully.`,
            });
            cancelEditing();
        } catch (updateError) {
            setActionStatus({
                type: "error",
                message: updateError.message,
            });
        } finally {
            setSavingStudentId("");
        }
    };

    const handleDelete = async (studentId) => {
        const confirmed = window.confirm("Delete this student permanently?");

        if (!confirmed) {
            return;
        }

        setDeletingStudentId(studentId);
        setActionStatus({ type: "", message: "" });

        try {
            const response = await fetch(`/api/students/${studentId}`, {
                method: "DELETE",
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete student");
            }

            setStudents((current) =>
                current.filter((student) => student._id !== studentId)
            );

            if (editingStudentId === studentId) {
                cancelEditing();
            }

            setActionStatus({
                type: "success",
                message: `${data.student.name} deleted successfully.`,
            });
        } catch (deleteError) {
            setActionStatus({
                type: "error",
                message: deleteError.message,
            });
        } finally {
            setDeletingStudentId("");
        }
    };

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
                    {actionStatus.message ? (
                        <p
                            className={`mb-5 rounded-2xl px-4 py-3 text-sm ${
                                actionStatus.type === "success"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-red-50 text-red-700"
                            }`}
                        >
                            {actionStatus.message}
                        </p>
                    ) : null}

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
                            {students.map((student) => {
                                const isEditing = editingStudentId === student._id;
                                const isSaving = savingStudentId === student._id;
                                const isDeleting = deletingStudentId === student._id;

                                return (
                                    <article
                                        className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                                        key={student._id}
                                    >
                                        {isEditing ? (
                                            <div className="space-y-4">
                                                <input
                                                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
                                                    name="name"
                                                    onChange={handleEditChange}
                                                    required
                                                    type="text"
                                                    value={editForm.name}
                                                />
                                                <input
                                                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
                                                    min="1"
                                                    name="age"
                                                    onChange={handleEditChange}
                                                    required
                                                    type="number"
                                                    value={editForm.age}
                                                />
                                                <input
                                                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
                                                    name="dep"
                                                    onChange={handleEditChange}
                                                    required
                                                    type="text"
                                                    value={editForm.dep}
                                                />
                                                <input
                                                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
                                                    name="country"
                                                    onChange={handleEditChange}
                                                    required
                                                    type="text"
                                                    value={editForm.country}
                                                />
                                                <div className="flex gap-3">
                                                    <button
                                                        className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                                                        disabled={isSaving}
                                                        onClick={() => handleUpdate(student._id)}
                                                        type="button"
                                                    >
                                                        {isSaving ? "Saving..." : "Save"}
                                                    </button>
                                                    <button
                                                        className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                                        disabled={isSaving}
                                                        onClick={cancelEditing}
                                                        type="button"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
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
                                                <div className="mt-5 flex gap-3">
                                                    <button
                                                        className="rounded-2xl px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                                        disabled={isDeleting}
                                                        onClick={() => startEditing(student)}
                                                        onMouseEnter={() => setHoveredButton(`edit-${student._id}`)}
                                                        onMouseLeave={() => setHoveredButton("")}
                                                        style={{
                                                            backgroundColor:
                                                                hoveredButton === `edit-${student._id}`
                                                                    ? "#15803d"
                                                                    : "#16a34a",
                                                            border: "1px solid #166534",
                                                        }}
                                                        type="button"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="rounded-2xl px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                                                        disabled={isDeleting}
                                                        onClick={() => handleDelete(student._id)}
                                                        onMouseEnter={() => setHoveredButton(`delete-${student._id}`)}
                                                        onMouseLeave={() => setHoveredButton("")}
                                                        style={{
                                                            backgroundColor:
                                                                hoveredButton === `delete-${student._id}`
                                                                    ? "#b91c1c"
                                                                    : "#dc2626",
                                                            border: "1px solid #991b1b",
                                                        }}
                                                        type="button"
                                                    >
                                                        {isDeleting ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    ) : null}
                </section>
            </div>
        </div>
    );
}
