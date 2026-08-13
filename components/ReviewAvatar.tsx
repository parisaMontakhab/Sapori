"use client";

import Image from "next/image";
import { useState } from "react";
import type { ReviewUser } from "@/types";

export default function ReviewAvatar({ user }: { user: ReviewUser }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = Boolean(user.photoUrl) && !imageFailed;

  if (showPhoto && user.photoUrl) {
    return (
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full shadow-sm sm:h-11 sm:w-11">
        <Image
          src={user.photoUrl}
          alt={user.name}
          fill
          sizes="44px"
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-tomato to-orange text-sm font-bold text-white shadow-sm sm:h-11 sm:w-11">
      {user.name.charAt(0).toUpperCase()}
    </div>
  );
}
