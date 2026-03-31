import { useState } from "react";

const initialForm = {
    name: "",
    age: "",
    dep: "",
    country: "",
};

export default function StudentFormPage() {
    const [formData, setFormData] = useState(initialForm);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: "", message: "" });

        try {
            const response = await fetch("/api/students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    age: Number(formData.age),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to save student");
            }

            setStatus({
                type: "success",
                message: `Saved ${data.student.name} to universityDB.student`,
            });
            setFormData(initialForm);
        } catch (error) {
            setStatus({
                type: "error",
                message: error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe,_#f8fafc_55%,_#e0f2fe)] px-4 py-10">
            <div className="mx-auto max-w-5xl">
                <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
                    <section className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
                        <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-1 text-sm tracking-[0.2em] text-sky-200 uppercase">
                            Student Manager
                        </p>
                        <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
                            Insert student data into MongoDB
                        </h1>
                        <p className="max-w-xl text-base text-slate-300 md:text-lg">
                            This form sends data to your Express API and stores it in
                            the <span className="font-semibold text-white">student</span>
                            {" "}collection inside{" "}
                            <span className="font-semibold text-white">universityDB</span>.
                        </p>
                        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
                            <p className="text-sm text-slate-300">Example document</p>
                            <pre className="mt-3 overflow-x-auto text-sm text-sky-100">
{`{
  "name": "Karim",
  "age": 14,
  "dep": "science",
  "country": "Bangladesh"
}`}
                            </pre>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
                        <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                            Add New Student
                        </h2>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                    htmlFor="name"
                                >
                                    Name
                                </label>
                                <input
                                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
                                    id="name"
                                    name="name"
                                    onChange={handleChange}
                                    placeholder="Karim"
                                    required
                                    type="text"
                                    value={formData.name}
                                />
                            </div>

                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                    htmlFor="age"
                                >
                                    Age
                                </label>
                                <input
                                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
                                    id="age"
                                    min="1"
                                    name="age"
                                    onChange={handleChange}
                                    placeholder="14"
                                    required
                                    type="number"
                                    value={formData.age}
                                />
                            </div>

                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                    htmlFor="dep"
                                >
                                    Department
                                </label>
                                <input
                                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
                                    id="dep"
                                    name="dep"
                                    onChange={handleChange}
                                    placeholder="science"
                                    required
                                    type="text"
                                    value={formData.dep}
                                />
                            </div>

                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                    htmlFor="country"
                                >
                                    Country
                                </label>
                                <input
                                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
                                    id="country"
                                    name="country"
                                    onChange={handleChange}
                                    placeholder="Bangladesh"
                                    required
                                    type="text"
                                    value={formData.country}
                                />
                            </div>

                            <button
                                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                                disabled={isSubmitting}
                                type="submit"
                            >
                                {isSubmitting ? "Saving..." : "Save Student"}
                            </button>
                        </form>

                        {status.message ? (
                            <p
                                className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
                                    status.type === "success"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-red-50 text-red-700"
                                }`}
                            >
                                {status.message}
                            </p>
                        ) : null}
                    </section>
                </div>
            </div>
        </div>
    );
}
