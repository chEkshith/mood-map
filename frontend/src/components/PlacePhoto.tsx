import {
  BookOpen,
  Clapperboard,
  Coffee,
  Dumbbell,
  Hotel,
  Landmark,
  MapPin,
  Mountain,
  Music,
  ShoppingBag,
  Trees,
  UtensilsCrossed,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Category {
  label: string;
  Icon: LucideIcon;
  gradient: string;
}

const DEFAULT_CATEGORY: Category = {
  label: "Place",
  Icon: MapPin,
  gradient: "from-violet-500/30 via-indigo-500/15 to-[#080a16]",
};

const CATEGORIES: { matches: string[]; category: Category }[] = [
  {
    matches: ["cafe", "coffee_shop", "bakery"],
    category: {
      label: "Cafe",
      Icon: Coffee,
      gradient: "from-amber-500/35 via-orange-500/15 to-[#080a16]",
    },
  },
  {
    matches: ["park", "garden", "national_park", "state_park"],
    category: {
      label: "Park",
      Icon: Trees,
      gradient: "from-emerald-500/35 via-teal-500/15 to-[#080a16]",
    },
  },
  {
    matches: ["museum", "art_gallery", "tourist_attraction"],
    category: {
      label: "Culture",
      Icon: Landmark,
      gradient: "from-violet-500/35 via-fuchsia-500/15 to-[#080a16]",
    },
  },
  {
    matches: ["book_store", "library"],
    category: {
      label: "Books",
      Icon: BookOpen,
      gradient: "from-sky-500/35 via-blue-500/15 to-[#080a16]",
    },
  },
  {
    matches: ["restaurant", "food", "meal_takeaway", "meal_delivery"],
    category: {
      label: "Food",
      Icon: UtensilsCrossed,
      gradient: "from-rose-500/35 via-orange-500/15 to-[#080a16]",
    },
  },
  {
    matches: ["bar", "night_club", "liquor_store"],
    category: {
      label: "Nightlife",
      Icon: Music,
      gradient: "from-fuchsia-500/35 via-purple-500/15 to-[#080a16]",
    },
  },
  {
    matches: ["gym", "spa", "wellness"],
    category: {
      label: "Wellness",
      Icon: Dumbbell,
      gradient: "from-lime-500/30 via-emerald-500/15 to-[#080a16]",
    },
  },
  {
    matches: ["shopping_mall", "store", "clothing_store"],
    category: {
      label: "Shopping",
      Icon: ShoppingBag,
      gradient: "from-pink-500/30 via-rose-500/15 to-[#080a16]",
    },
  },
  {
    matches: ["movie_theater", "casino"],
    category: {
      label: "Entertainment",
      Icon: Clapperboard,
      gradient: "from-indigo-500/35 via-violet-500/15 to-[#080a16]",
    },
  },
  {
    matches: ["lodging", "hotel"],
    category: {
      label: "Stay",
      Icon: Hotel,
      gradient: "from-cyan-500/30 via-sky-500/15 to-[#080a16]",
    },
  },
  {
    matches: ["beach", "marina"],
    category: {
      label: "Waterfront",
      Icon: Waves,
      gradient: "from-cyan-500/35 via-blue-500/15 to-[#080a16]",
    },
  },
  {
    matches: ["hiking_area", "campground"],
    category: {
      label: "Outdoors",
      Icon: Mountain,
      gradient: "from-green-500/30 via-emerald-500/15 to-[#080a16]",
    },
  },
];

function resolveCategory(types: string[] = []): Category {
  for (const { matches, category } of CATEGORIES) {
    if (types.some((type) => matches.includes(type))) {
      return category;
    }
  }
  return DEFAULT_CATEGORY;
}

interface Props {
  photoUrl?: string | null;
  name: string;
  types?: string[];
  variant?: "card" | "detail";
  className?: string;
}

export function PlacePhoto({
  photoUrl,
  name,
  types,
  variant = "card",
  className = "",
}: Props) {
  const [failed, setFailed] = useState(false);
  const isDetail = variant === "detail";
  const category = resolveCategory(types);
  const Icon = category.Icon;
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  useEffect(() => {
    setFailed(false);
  }, [photoUrl]);

  if (photoUrl && !failed) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${category.gradient} ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 18%, rgba(255,255,255,0.16), transparent 42%), radial-gradient(circle at 82% 84%, rgba(255,255,255,0.09), transparent 38%)",
        }}
      />
      <span
        className={`pointer-events-none absolute select-none font-display font-bold leading-none text-white/[0.07] ${
          isDetail ? "-bottom-10 right-4 text-[12rem]" : "-bottom-5 right-2 text-[6.5rem]"
        }`}
      >
        {initial}
      </span>
      <Icon
        className={`relative text-white/80 drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)] ${
          isDetail ? "h-12 w-12" : "h-8 w-8"
        }`}
      />
      <span
        className={`relative mt-2 font-medium uppercase tracking-[0.22em] text-white/70 ${
          isDetail ? "text-xs" : "text-[10px]"
        }`}
      >
        {category.label}
      </span>
    </div>
  );
}
