import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h2 className="text-2xl font-bold font-Raleway mb-4">Not Found</h2>
      <p className="text-lg mb-6">Could not find requested resource</p>
      <Link href="/">
        <span className="text-primary-10 hover:underline">Return Home</span>
      </Link>
    </div>
  );
}
