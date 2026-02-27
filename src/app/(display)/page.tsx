import type { Metadata } from "next";
import { JourneyBoard } from "@/components/board/journey-board";

export const metadata: Metadata = {
  title: "SW Painel - From Zero to Hero",
  description:
    "Painel LED interativo para acompanhar a jornada das equipes no Startup Weekend",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
  },
};

export default function DisplayPage() {
  return (
    <main className="h-full w-full">
      <JourneyBoard />
    </main>
  );
}
