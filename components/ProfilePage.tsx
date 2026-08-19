"use client";

import ChangePasswordForm from "@/components/ChangePasswordForm";
import { useCurrentUser, useUpdateProfile } from "@/hooks/useAuth";
import { useMyOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { useReviewedProductIds } from "@/hooks/useReviews";
import { getErrorMessage } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { getProductReviewHref, isReviewableOrder } from "@/lib/reviews";
import { isInlinePhotoUrl } from "@/lib/userPhoto";
import { getAuthToken, getLoggedInUser, logout } from "@/store/auth";
import type { Order, Product, User } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

function getItemCount(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

function formatItemSummary(count: number): string {
  return count === 1 ? "1 item" : `${count} items`;
}

function OrderItemReviewLink({
  productId,
  hasReview,
}: {
  productId: string;
  hasReview: boolean;
}) {
  return (
    <Link
      href={getProductReviewHref(productId)}
      className="shrink-0 text-sm font-semibold text-tomato hover:underline"
    >
      {hasReview ? "Edit Review" : "Write a Review"}
    </Link>
  );
}

function getStatusBadgeClasses(status: Order["status"] | "cancelled"): string {
  if (status === "delivered") return "bg-basil/10 text-basil";
  if (status === "cancelled") return "bg-tomato/10 text-tomato";
  return "bg-orange/10 text-orange";
}

function formatStatusLabel(status: Order["status"] | "cancelled"): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getFavoriteCategory(orders: Order[], products: Product[]): string {
  const counts: Record<string, number> = {};

  for (const order of orders) {
    for (const item of order.items) {
      const category = products.find(
        (product) => product.id === item.productId,
      )?.category;

      if (category) {
        counts[category] = (counts[category] ?? 0) + item.quantity;
      }
    }
  }

  const topCategory = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return topCategory?.[0] ?? "—";
}

function ProfileAvatar({
  user,
  previewUrl,
}: {
  user: User;
  previewUrl?: string | null;
}) {
  const displayUrl = previewUrl ?? user.photoUrl;

  return (
    <ProfileAvatarImage
      key={displayUrl ?? "no-photo"}
      user={user}
      displayUrl={displayUrl}
    />
  );
}

function ProfileAvatarImage({
  user,
  displayUrl,
}: {
  user: User;
  displayUrl?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = Boolean(displayUrl) && !imageFailed;

  if (showPhoto && displayUrl) {
    if (isInlinePhotoUrl(displayUrl)) {
      return (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full shadow-md sm:h-20 sm:w-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayUrl}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full shadow-md sm:h-20 sm:w-20">
        <Image
          src={displayUrl}
          alt={user.name}
          fill
          sizes="80px"
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-tomato to-orange text-2xl font-bold text-white shadow-md sm:h-20 sm:w-20 sm:text-3xl">
      {user.name.charAt(0).toUpperCase()}
    </div>
  );
}

const inputClassName =
  "w-full min-w-0 rounded-xl border border-cream-dark bg-cream px-4 py-3 focus:border-basil focus:ring-2 focus:ring-basil/20 focus:outline-none";

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const user = currentUser ?? getLoggedInUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [name, setName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const photoPreviewUrlRef = useRef<string | null>(null);
  const [validationError, setValidationError] = useState("");
  const {
    data: orders = [],
    isPending: isOrdersPending,
    isError: isOrdersError,
    error: ordersError,
  } = useMyOrders();
  const { data: products = [] } = useProducts();
  const ordersErrorToasted = useRef(false);
  const reviewableProductIds = useMemo(() => {
    const ids = new Set<string>();

    for (const order of orders) {
      if (!isReviewableOrder(order)) continue;

      for (const item of order.items) {
        ids.add(item.productId);
      }
    }

    return [...ids];
  }, [orders]);
  const reviewedProductIds = useReviewedProductIds(
    reviewableProductIds,
    user?.id,
  );

  useEffect(() => {
    if (isOrdersError && ordersError && !ordersErrorToasted.current) {
      ordersErrorToasted.current = true;
      toast.error(
        getErrorMessage(
          ordersError,
          "Something went wrong loading your orders.",
        ),
      );
    }

    if (!isOrdersError) {
      ordersErrorToasted.current = false;
    }
  }, [isOrdersError, ordersError]);

  useEffect(() => {
    photoPreviewUrlRef.current = photoPreviewUrl;
  }, [photoPreviewUrl]);

  useEffect(() => {
    return () => {
      if (photoPreviewUrlRef.current) {
        URL.revokeObjectURL(photoPreviewUrlRef.current);
      }
    };
  }, []);

  function revokePhotoPreview(url: string | null) {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }

  function resetPhotoSelection() {
    setPhotoPreviewUrl((current) => {
      revokePhotoPreview(current);
      return null;
    });
    setPhotoFile(null);
  }

  function handleStartEdit() {
    if (!user) return;
    setName(user.name);
    resetPhotoSelection();
    setValidationError("");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    if (!user) return;
    resetPhotoSelection();
    setName(user.name);
    setValidationError("");
    setIsEditing(false);
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setValidationError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    setValidationError("");
    setPhotoFile(file);
    setPhotoPreviewUrl((current) => {
      revokePhotoPreview(current);
      return URL.createObjectURL(file);
    });
  }

  function handleSaveProfile(event: React.FormEvent) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setValidationError("Name cannot be empty.");
      return;
    }

    setValidationError("");

    updateProfileMutation.mutate(
      {
        name: trimmedName,
        photo: photoFile ?? undefined,
      },
      {
        onSuccess: () => {
          resetPhotoSelection();
          setIsEditing(false);
          toast.success("Profile updated successfully!");
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, "Failed to update profile"));
        },
      },
    );
  }

  function handleLogout() {
    logout();
    queryClient.removeQueries({ queryKey: queryKeys.auth.me });
    queryClient.removeQueries({ queryKey: queryKeys.orders.all });
    toast.success("Logged out successfully.");
    router.push("/login");
  }

  function getProductImage(productId: string): string | undefined {
    return products.find((product) => product.id === productId)?.imageUrl;
  }

  if (!getAuthToken() && !user) {
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-md sm:p-12">
        <p className="text-5xl">👋</p>
        <p className="mt-4 text-lg font-medium">You are not logged in</p>
        <p className="mt-1 text-foreground/60">
          Sign in to view your profile and orders.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-tomato px-8 py-3 font-semibold text-white shadow-md hover:bg-tomato-dark"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-md sm:p-12">
        <p className="text-sm text-foreground/60">Loading profile...</p>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const favoriteCategory = getFavoriteCategory(orders, products);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-1 text-foreground/60">
          Manage your account and orders
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-md">
        <div className="bg-gradient-to-r from-tomato/10 via-orange/10 to-cream-dark px-4 py-5 sm:px-8">
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
                <ProfileAvatar
                  user={{ ...user, name: name.trim() || user.name }}
                  previewUrl={photoPreviewUrl}
                />
                <div className="min-w-0 flex-1 space-y-4">
                  <div>
                    <label
                      htmlFor="profile-photo"
                      className="mb-1.5 block text-sm font-medium text-foreground/80"
                    >
                      Profile photo
                    </label>
                    <input
                      id="profile-photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full min-w-0 text-sm text-foreground/70 file:mr-3 file:rounded-full file:border-0 file:bg-tomato/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-tomato hover:file:bg-tomato/20"
                    />
                    <p className="mt-1 text-xs text-foreground/50">
                      Select one image. It will upload when you save.
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="profile-name"
                      className="mb-1.5 block text-sm font-medium text-foreground/80"
                    >
                      Name
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className={inputClassName}
                      autoComplete="name"
                    />
                  </div>
                </div>
              </div>

              {validationError && (
                <p className="rounded-lg bg-tomato/10 px-4 py-2 text-sm text-tomato">
                  {validationError}
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={updateProfileMutation.isPending}
                  className="min-h-11 rounded-full border border-cream-dark bg-white px-6 py-2.5 text-sm font-semibold text-foreground/80 transition-colors hover:bg-cream disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="min-h-11 rounded-full bg-tomato px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-tomato-dark disabled:opacity-60"
                >
                  {updateProfileMutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
              <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                <ProfileAvatar user={user} />
                <div className="min-w-0">
                  <p className="truncate text-xl font-bold text-foreground sm:text-2xl">
                    {user.name}
                  </p>
                  <p className="mt-1 text-sm text-foreground/60">
                    Food Lover • Member since 2026
                  </p>
                  <p className="mt-2 truncate text-sm text-foreground/70">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="min-h-11 rounded-full border border-basil/30 bg-white px-6 py-2.5 text-sm font-semibold text-basil transition-colors hover:bg-basil/5"
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="min-h-11 rounded-full border border-tomato/30 bg-white px-6 py-2.5 text-sm font-semibold text-tomato transition-colors hover:bg-tomato/5"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-md">
          <p className="text-2xl" role="img" aria-hidden>
            📦
          </p>
          <p className="mt-3 text-sm text-foreground/60">Total Orders</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {isOrdersPending ? "—" : orders.length}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-md">
          <p className="text-2xl" role="img" aria-hidden>
            💰
          </p>
          <p className="mt-3 text-sm text-foreground/60">Total Spent</p>
          <p className="mt-1 text-2xl font-bold text-tomato">
            {isOrdersPending ? "—" : `€${totalSpent}`}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-md">
          <p className="text-2xl" role="img" aria-hidden>
            🍕
          </p>
          <p className="mt-3 text-sm text-foreground/60">Favorite Category</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {isOrdersPending ? "—" : favoriteCategory}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-md sm:p-6">
        <h2 className="text-lg font-bold text-foreground">Security</h2>
        <p className="mt-1 text-sm text-foreground/60">
          Update your account password.
        </p>

        {isChangingPassword ? (
          <div className="mt-5">
            <ChangePasswordForm onCancel={() => setIsChangingPassword(false)} />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsChangingPassword(true)}
            className="mt-5 min-h-11 rounded-full border border-basil/30 bg-white px-6 py-2.5 text-sm font-semibold text-basil transition-colors hover:bg-basil/5"
          >
            Change Password
          </button>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold text-foreground">Your Orders</h2>

        {isOrdersPending ? (
          <p className="text-sm text-foreground/60">Loading orders...</p>
        ) : isOrdersError ? (
          <p className="rounded-lg bg-tomato/10 px-4 py-2 text-sm text-tomato">
            {getErrorMessage(
              ordersError,
              "Something went wrong loading your orders.",
            )}
          </p>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md sm:p-12">
            <p className="text-5xl">📦</p>
            <p className="mt-4 text-lg font-semibold text-foreground">
              No orders yet
            </p>
            <p className="mt-2 text-foreground/60">
              Place your first order and track it here.
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-block rounded-full bg-tomato px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-tomato-dark"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const itemCount = getItemCount(order);
              const firstImage = getProductImage(
                order.items[0]?.productId ?? "",
              );

              return (
                <article
                  key={order.id}
                  className="rounded-2xl bg-white p-4 shadow-md sm:p-5"
                >
                  <div className="flex gap-4 sm:gap-5">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
                      {firstImage ? (
                        <Image
                          src={firstImage}
                          alt={order.items[0]?.name ?? "Order item"}
                          fill
                          sizes="(max-width: 640px) 96px, 112px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-cream-dark text-3xl">
                          🍽️
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-foreground">
                            Order #{order.orderNumber ?? order.id}
                          </p>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClasses(order.status)}`}
                          >
                            {formatStatusLabel(order.status)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-foreground/60">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground/80">
                          {formatItemSummary(itemCount)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
                        <p className="text-sm text-foreground/60 sm:text-right">
                          Total
                        </p>
                        <p className="text-xl font-bold text-tomato sm:text-2xl">
                          €{order.total}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isReviewableOrder(order) && order.items.length > 0 && (
                    <ul className="mt-4 space-y-2 border-t border-cream-dark pt-4">
                      {order.items.map((item) => (
                        <li
                          key={`${order.id}-${item.productId}`}
                          className="flex flex-wrap items-center justify-between gap-2"
                        >
                          <span className="min-w-0 truncate text-sm text-foreground/80">
                            {item.name}
                            {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                          </span>
                          <OrderItemReviewLink
                            productId={item.productId}
                            hasReview={reviewedProductIds.has(item.productId)}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
