import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { terms } from "@/lib/legal";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of use | Instayhomes" },
      { name: "description", content: "The terms for using Instayhomes and Instayhomes Plus." },
    ],
  }),
  component: () => <LegalPage doc={terms} current="terms" />,
});
