import Link from "next/link";

export default function Admin() {
  return (
    <>
      <p className="m-7 text-xl">
        Did you mean to go to the{" "}
        <Link className="text-secondary-500" href={"/admin/dashboard"}>
          Dashboard
        </Link>
        ?
      </p>
    </>
  );
}
