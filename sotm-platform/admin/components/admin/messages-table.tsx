import { API_URL } from "@/lib/api";
// "use client";
// import { Message } from "@/lib/types";
// import { format } from "date-fns";
// import { Geist } from "next/font/google";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Link from "next/link";

// const geistSans = Geist({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// export default function MessagesTable() {
//   const [messages, setMessages] = useState<Message[]>([]);

//   async function fetchMessages() {
//     try {
//       // Get the auth token from localStorage
//       const authToken = localStorage.getItem("access_token");

//       if (!authToken) {
//         console.error("No auth token found");
//         return;
//       }

//       const res = await fetch(
//         // `${API_URL}/messages/admin/all`
//         `${API_URL}/messages/admin/all`,
//         {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = await res.json();
//       if (data.statusCode === 401) {
//         throw new Error("Unauthorized");
//       }
//       setMessages(data);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   async function handleDeleteMessage(messageId: string) {
//     try {
//       const response = await axios.delete(
//         `${API_URL}/messages/${messageId}`
//       );
//       console.log(response.data);
//       fetchMessages();
//     } catch (error) {
//       console.error("Error deleting message:", error);
//     }
//   }

//   return (
//     <div className="h-full overflow-auto border rounded-xs scrollbar-thin">
//       <table className="w-full">
//         <thead
//           className={`${geistSans.className} text-sm bg-muted sticky top-0`}
//         >
//           <tr className="text-left [&_th]:font-semibold">
//             <th className="py-3 pl-4 bg-muted">Title</th>
//             <th className="py-3 bg-muted">Speaker</th>
//             <th className="py-3 bg-muted">Date</th>
//             <th className="py-3 bg-muted">Category</th>
//             <th className="py-3 bg-muted">Url</th>
//             <th className="py-3 pr-4 bg-muted">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {messages.map((message) => (
//             <tr
//               key={message._id}
//               className={`border-b border-b-black/10 transition-all duration-200 text-sm ${geistSans.className} hover:bg-muted/50`}
//             >
//               <td className="py-3 pl-4">{message.title}</td>
//               <td className="py-3">{message.speaker}</td>
//               <td className="py-3">
//                 {format(new Date(message.date), "MMM yyyy")}
//               </td>
//               <td className="py-3">{message.category.join(", ")}</td>
//               <td className="py-3 max-w-[150px] truncate pr-4">
//                 <a
//                   href={message.downloadUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-400 underline"
//                   title={message.downloadUrl}
//                 >
//                   {message.downloadUrl}
//                 </a>
//               </td>
//               <td className="py-3 pr-4">
//                 <Link
//                   href={`/admin/messages/edit/${message._id}`}
//                   className="mr-2 bg-gray-100 px-2 py-1 hover:bg-gray-200 text-xs rounded"
//                 >
//                   Edit
//                 </Link>
//                 <button
//                   className="bg-gray-100 px-2 py-1 hover:bg-red-200 text-xs rounded"
//                   onClick={() => handleDeleteMessage(message._id)}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client";
import { Message } from "@/lib/types";
import { format } from "date-fns";
import { Geist } from "next/font/google";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { ExternalLink, Edit, Trash2, AlertCircle, Star } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const geistSans = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function MessagesTable() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  async function fetchMessages() {
    setIsLoading(true);
    try {
      // Get the auth token from localStorage
      const access_token = localStorage.getItem("access_token");

      if (!access_token) {
        console.error("No auth token found");
        return;
      }

      const res = await fetch(
        `${API_URL}/messages/admin/all`,
        // `${API_URL}/messages/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      if (data.statusCode === 401) {
        throw new Error("Unauthorized");
      }
      setMessages(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleFeatured(id: string) {
    try {
      const access_token = localStorage.getItem("access_token");
      await axios.patch(
        `${API_URL}/messages/${id}/toggle-featured`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Refresh the messages list
      fetchMessages();
      toast.success("Featured status updated successfully");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.message || "Failed to update featured status"
        );
      } else {
        toast.error("Failed to update featured status");
      }
      console.error("Error toggling featured status:", error);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  async function handleDeleteMessage(messageId: string) {
    try {
      const access_token = localStorage.getItem("access_token");
      if (!access_token) {
        console.error("No auth token found");
        return;
      }

      const response = await axios.delete(
        `${API_URL}/messages/${messageId}`,
        // `${API_URL}/messages/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Message deleted successfully");
      }
      console.log(response.data);
      fetchMessages();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to delete message");
      } else {
        toast.error("Failed to delete message");
      }
      console.error("Error deleting message:", error);
    }
  }

  const openDeleteDialog = (messageId: string) => {
    setMessageToDelete(messageId);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading messages...</div>
      </div>
    );
  }

  // Mobile view - card layout
  // Mobile view - card layout
  if (isMobile) {
    return (
      <>
        <div className="h-full overflow-auto scrollbar-thin space-y-4 p-4">
          {messages.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No messages found
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`${geistSans.className} border rounded-lg p-4 shadow-sm space-y-3 bg-white`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{message.title}</h3>
                    <p className="text-sm text-gray-600">{message.speaker}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFeatured(message._id)}
                    title={
                      message.featured
                        ? "Remove from featured"
                        : "Add to featured"
                    }
                    className="p-1"
                  >
                    <Star
                      size={18}
                      className={
                        message.featured
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-400"
                      }
                    />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {format(new Date(message.date), "MMM yyyy")}
                  </span>
                  {message.category.map((cat, idx) => (
                    <span key={idx} className="bg-gray-100 px-2 py-1 rounded">
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-gray-500 truncate">
                  <a
                    href={message.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 flex items-center gap-1"
                  >
                    <ExternalLink size={12} />
                    <span className="truncate">{message.downloadUrl}</span>
                  </a>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/admin/messages/edit/${message._id}`}
                    className="flex-1 bg-gray-100 py-2 flex items-center justify-center gap-1 rounded text-xs font-medium hover:bg-gray-200 transition-colors"
                  >
                    <Edit size={12} />
                    Edit
                  </Link>
                  <button
                    className="flex-1 bg-gray-100 py-2 flex items-center justify-center gap-1 rounded text-xs font-medium hover:bg-red-200 transition-colors text-red-600"
                    onClick={() => openDeleteDialog(message._id)}
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <DeleteConfirmationDialog />
      </>
    );
  }

  // Desktop view - table layout
  return (
    <>
      <div className="h-full overflow-auto border rounded-xs scrollbar-thin">
        <table className="w-full">
          <thead
            className={`${geistSans.className} text-sm bg-muted sticky top-0`}
          >
            <tr className="text-left [&_th]:font-semibold">
              <th className="py-3 pl-4 bg-muted">Title</th>
              <th className="py-3 bg-muted">Speaker</th>
              <th className="py-3 bg-muted">Date</th>
              <th className="py-3 bg-muted">Category</th>
              <th className="py-3 bg-muted">Url</th>
              <th className="py-3 bg-muted">Featured</th>
              <th className="py-3 pr-4 bg-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  No messages found
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr
                  key={message._id}
                  className={`border-b border-b-black/10 transition-all duration-200 text-sm ${geistSans.className} hover:bg-muted/50`}
                >
                  <td className="py-3 pl-4">{message.title}</td>
                  <td className="py-3">{message.speaker}</td>
                  <td className="py-3">
                    {format(new Date(message.date), "MMM yyyy")}
                  </td>
                  <td className="py-3">{message.category.join(", ")}</td>
                  <td className="py-3 max-w-[150px] truncate pr-4">
                    <a
                      href={message.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline flex items-center gap-1"
                      title={message.downloadUrl}
                    >
                      <ExternalLink size={12} />
                      <span className="truncate">{message.downloadUrl}</span>
                    </a>
                  </td>
                  <td className="py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeatured(message._id)}
                      title={
                        message.featured
                          ? "Remove from featured"
                          : "Add to featured"
                      }
                    >
                      <Star
                        size={18}
                        className={
                          message.featured
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400"
                        }
                      />
                    </Button>
                  </td>
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/messages/edit/${message._id}`}
                      className="mr-2 bg-gray-100 px-2 py-1 hover:bg-gray-200 text-xs rounded inline-flex items-center gap-1"
                    >
                      <Edit size={12} />
                      Edit
                    </Link>
                    <button
                      className="bg-gray-100 px-2 py-1 hover:bg-red-200 text-xs rounded inline-flex items-center gap-1 text-red-600"
                      onClick={() => openDeleteDialog(message._id)}
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <DeleteConfirmationDialog />
    </>
  );

  function DeleteConfirmationDialog() {
    return (
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="destructive"
              onClick={() =>
                messageToDelete && handleDeleteMessage(messageToDelete)
              }
            >
              Delete
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}
