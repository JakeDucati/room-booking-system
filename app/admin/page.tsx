import Link from "next/link";

export default function Admin() {
    return (
        <>
            <p className="m-7 text-xl">
                Did you mean to go to the <Link href={"/admin/dashboard"} className="text-secondary-500">Dashboard</Link>?
            </p>
        </>
    );
}