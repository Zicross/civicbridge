/**
 * Admin queue page for ConstiuINT.
 * Authorized admins can review and transition messages.
 */
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/config";
import { isAdmin } from "@/server/auth/requireAdmin";
import { AdminQueueTable } from "@/components/AdminQueueTable";

export default function AdminPage() {
  // Check authentication
  const user = getCurrentUser();
  if (!user) {
    redirect("/");
  }

  // Check admin authorization
  if (!isAdmin(user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin access to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ConstiuINT Admin Queue</h1>
          <p className="mt-2 text-gray-600">
            Review and manage constituent feedback messages. All transitions are audited.
          </p>
        </div>

        <AdminQueueTable />
      </div>
    </div>
  );
}