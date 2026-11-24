import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { privacy } from "@/lib/legal";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy | Instayhomes" },
      {
        name: "description",
        content: "What data Instayhomes collects, how we use it, and your rights.",
      },
    ],
  }),
  component: () => <LegalPage doc={privacy} current="privacy" />,
});
