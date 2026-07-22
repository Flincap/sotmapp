import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 mb-4 bg-red-100 rounded-full">
            <ShieldAlert className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        </div>

        <div className="space-y-4 text-center">
          <p className="text-gray-600">
            You don&apos;t have permission to access this area. Your
            authentication token may be invalid or expired.
          </p>
          <p className="text-sm text-gray-500">
            Please log in with valid credentials to continue.
          </p>
        </div>

        <div className="flex flex-col space-y-3 pt-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/" className="flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return to Messages
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
