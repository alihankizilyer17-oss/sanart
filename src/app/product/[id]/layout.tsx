import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function generateStaticParams() {
  const snapshot = await getDocs(collection(db, "products"));

  return snapshot.docs
    .map((doc) => {
      if (!doc.id || doc.id.trim() === "") {
        return null;
      }

      return {
        id: doc.id,
      };
    })
    .filter(
      (item): item is { id: string } => item !== null
    );
}

export default function ProductIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}