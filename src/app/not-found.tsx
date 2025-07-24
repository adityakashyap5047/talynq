import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-br text-white px-6 py-12 text-center">

      <h1 className="text-8xl font-extrabold tracking-tight gradient-title my-12">
        404
      </h1>

      <h2 className="text-2xl sm:text-4xl font-semibold mb-2">
        Page Not Found
      </h2>

      <p className="text-gray-300 max-w-md mb-6">
        The page you{"'"}re looking for doesn{"'"}t exist or has been moved. You might have followed a broken link or mistyped the URL.
      </p>

      <Link href="/">
        <Button variant="blue" className="flex items-center gap-2">
          <ArrowLeft size={18} />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}