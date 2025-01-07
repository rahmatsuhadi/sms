"use client";
import { Category, Item } from "@prisma/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useDeleteCateogry } from "@/hooks/useCategories";
import { useState } from "react";
import { LoaderIcon } from "lucide-react";

export function DialogDeleteCategory({
  isOpen,
  data,
  onClose,
  refetch,
}: {
  refetch: () => void;
  data: Category;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { mutate } = useDeleteCateogry(data.id);
  const [loading, setLoading] = useState<boolean>(false);

  const onDelete = async () => {
    setLoading(true);
    const request = await mutate();
    if (request) {
      onClose();
      refetch();
    }
    setLoading(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            data and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}> {loading ? <LoaderIcon className="animate-spin"/> : "Continue"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
