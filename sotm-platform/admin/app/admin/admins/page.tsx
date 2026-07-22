"use client";

import { API_URL } from "@/lib/api";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Admin {
  _id: string;
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const access_token = localStorage.getItem("access_token");
      if (!access_token) {
        console.error("No auth token found");
        return;
      }

      const response = await axios.get(
        `${API_URL}/admins`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAdmins(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to fetch admins");
      } else {
        toast.error("Failed to fetch admins");
      }
      console.error("Error fetching admins:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const openDeleteDialog = (adminId: string) => {
    setAdminToDelete(adminId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;
    
    try {
      const access_token = localStorage.getItem("access_token");
      if (!access_token) {
        console.error("No auth token found");
        return;
      }

      await axios.delete(
        `${API_URL}/admins/${adminToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      toast.success("Admin deleted successfully");
      fetchAdmins();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to delete admin");
      } else {
        toast.error("Failed to delete admin");
      }
      console.error("Error deleting admin:", error);
    } finally {
      setDeleteDialogOpen(false);
      setAdminToDelete(null);
    }
  };

  const DeleteConfirmationDialog = () => (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this admin? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteAdmin}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Admin Users</h2>
        <p className="text-muted-foreground">
          Manage admin users and their permissions
        </p>
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-left text-sm">
              <th className="p-2 font-medium">Email</th>
              <th className="p-2 font-medium">Role</th>
              <th className="p-2 font-medium">Created</th>
              <th className="p-2 font-medium">Last Updated</th>
              <th className="p-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-2 text-center">
                  Loading admins...
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-2 text-center">
                  No admins found
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr
                  key={admin._id}
                  className="border-b text-sm transition-colors hover:bg-muted/50"
                >
                  <td className="p-2">{admin.email}</td>
                  <td className="p-2">
                    {admin.isSuperAdmin ? (
                      <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                        Super Admin
                      </span>
                    ) : (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="p-2">
                    {format(new Date(admin.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="p-2">
                    {format(new Date(admin.updatedAt), "MMM d, yyyy HH:mm")}
                  </td>
                  <td className="p-2">
                    {!admin.isSuperAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                        onClick={() => openDeleteDialog(admin._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <DeleteConfirmationDialog />
    </div>
  );
}