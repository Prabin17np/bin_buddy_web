/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Controller, useForm } from "react-hook-form";
import { UserEditData, UserEditSchema } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { handleUpdateUser } from "@/lib/action/auth-action";

export default function EditUserForm() {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserEditData>({
    resolver: zodResolver(UserEditSchema),
  });
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    file: File | undefined,
    onChange: (file: File | undefined) => void,
  ) => {
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    } else {
      setPreviewImage(null);
    }

    onChange(file);
  };

  const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: UserEditData) => {
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        if (data.firstName) {
          formData.append("firstName", data.firstName);
        }
        if (data.lastName) {
          formData.append("lastName", data.lastName);
        }
        if (data.username) {
          formData.append("username", data.username);
        }
        if (data.profilePicture) {
          formData.append("profilePicture", data.profilePicture);
        }
        console.log([...formData.entries()]);

        const response = await handleUpdateUser(formData);

        if (!response.success) {
          throw new Error(response.message || "Update profile failed");
        }
        reset();
        handleDismissImage();
        toast.success("Profile Updated successfully");
      } catch (error: Error | any) {
        toast.error(error.message || "Create profile failed");
        setError(error.message || "Create profile failed");
      }
    });
  };
  console.log(errors);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Profile Image Display */}
      <div className="mb-4">
        {previewImage ? (
          <div className="relative w-24 h-24">
            <img
              src={previewImage}
              alt="Profile Image Preview"
              className="w-24 h-24 rounded-full object-cover"
            />
            <Controller
              name="profilePicture"
              control={control}
              render={({ field: { onChange } }) => (
                <button
                  type="button"
                  onClick={() => handleDismissImage(onChange)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ✕
                </button>
              )}
            />
          </div>
        ) : (
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600">No Image</span>
          </div>
        )}
      </div>
      {/* Profile Image Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Profile Image</label>
        <Controller
          name="profilePicture"
          control={control}
          render={({ field: { onChange } }) => (
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
              accept=".jpg,.jpeg,.png,.webp"
            />
          )}
        />
        {errors.profilePicture && (
          <p className="text-sm text-red-600">
            {errors.profilePicture.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="firstName">
            First name
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("firstName")}
            placeholder="Jane"
          />
          {errors.firstName?.message && (
            <p className="text-xs text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="lastName">
            Last name
          </label>
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("lastName")}
            placeholder="Doe"
          />
          {errors.lastName?.message && (
            <p className="text-xs text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("username")}
          placeholder="Jane Doe"
        />
        {errors.username?.message && (
          <p className="text-xs text-red-600">{errors.username.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting || pending ? "Updating profile..." : "Update Profile"}
      </button>
    </form>
  );
}
