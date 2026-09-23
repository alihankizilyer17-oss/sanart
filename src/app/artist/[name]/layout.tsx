
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function generateStaticParams() {
  const snapshot = await getDocs(collection(db, "artists"));

  return snapshot.docs
    .map((doc) => {
      const data = doc.data();

      if (typeof data.name !== "string" || data.name.trim() === "") {
        return null;
      }

      return {
        name: data.name,
      };
    })
    .filter(
      (item): item is { name: string } => item !== null
    );
}

export default function ArtistNameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

