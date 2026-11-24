// Terms of use and privacy policy wording.
// DRAFT: written to describe how Instayhomes works today. A lawyer must review it before launch;
// set `legalIsDraft` to false once they have, and update `legalUpdated`.
import { plans } from "@/lib/plus";

export const legalIsDraft = true;
export const legalUpdated = "24 November 2026";
// PLACEHOLDER: the company's registered name and support email.
export const companyName = "Instayhomes";
export const legalEmail = "hello@instayhomes.com";

export type LegalSection = { id: string; title: string; paragraphs?: string[]; list?: string[] };
export type LegalDoc = { shortVersion: string[]; sections: LegalSection[] };

const price = (id: string) => plans.find((plan) => plan.id === id)?.price ?? "";

export const terms: LegalDoc = {
  shortVersion: [
    "Browsing is free. Messaging landlords needs an Instayhomes Plus plan.",
    "A plan gives you 30 days of access and isn't renewed automatically.",
    "Your rental agreement is between you and the landlord, not us.",
    "If a home isn't as shown, you're eligible for a refund of your plan.",
  ],
  sections: [
    {
      id: "using-instayhomes",
      title: "Using Instayhomes",
      paragraphs: [
        `${companyName} lists rooms and homes for rent near universities in Zambia and connects students with the landlords who rent them.`,
        "You must be at least 16 to use Instayhomes, and the information you give us when you sign up must be true. Don't use Instayhomes to send spam, harass anyone, or advertise homes you don't have the right to rent.",
      ],
    },
    {
      id: "instayhomes-plus",
      title: "Instayhomes Plus",
      paragraphs: [
        `Instayhomes Plus lets you message landlords on WhatsApp. Self-service costs ${price("self-service")} and Assisted costs ${price("assisted")}. Each gives you 30 days of access from the moment your payment goes through.`,
        "You pay once, by mobile money. Plans don't renew automatically, so we never charge you again without you choosing to.",
        `International (${price("international")}) is for students moving from abroad. You talk to our team first and are only invoiced once you've chosen a home.`,
      ],
    },
    {
      id: "refunds",
      title: "Refunds",
      paragraphs: [
        "Under Tenant Protection, you're eligible for a refund of your plan if a home you contacted isn't as shown or is no longer available, and you tell us within your 30 days of access.",
        "To ask for a refund, message our team with the listing and what was wrong. We'll review it and, if it's eligible, return the money to the mobile money number you paid from.",
      ],
    },
    {
      id: "landlords-and-listings",
      title: "Landlords and listings",
      paragraphs: [
        "We check that landlords own or manage the homes they list before their listings go up. Checked landlords have a blue tick.",
        "Your rental agreement, rent and deposit are between you and the landlord. Instayhomes isn't a party to that agreement and doesn't collect rent. Always view a home before you pay any rent or deposit.",
      ],
    },
    {
      id: "your-account",
      title: "Your account",
      paragraphs: [
        "You log in with Google or with a code we email you. Keep access to your email safe, because anyone who can read it can log in as you.",
        "We may close accounts that break these terms, for example by advertising fake homes or harassing other people.",
      ],
    },
    {
      id: "our-responsibility",
      title: "Our responsibility",
      paragraphs: [
        "We work hard to keep listings accurate and landlords checked, but we can't guarantee every detail of every home. Our responsibility to you is limited to the amount you paid for your plan, except where the law of Zambia says otherwise.",
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      paragraphs: [
        "If we change these terms, we'll update the date at the top. If a change affects a plan you've already paid for, we'll tell you first.",
      ],
    },
    {
      id: "contact",
      title: "Contact us",
      paragraphs: [
        `Questions about these terms? Message our team on WhatsApp or email ${legalEmail}.`,
      ],
    },
  ],
};

export const privacy: LegalDoc = {
  shortVersion: [
    "We collect only what we need: your name, email and mobile money number.",
    "We never sell your data.",
    "Landlords only see what you send them on WhatsApp.",
    "You can ask us to delete your account at any time.",
  ],
  sections: [
    {
      id: "what-we-collect",
      title: "What we collect",
      list: [
        "Account: your name, email and, if you choose, your university.",
        "Payments: the mobile money number you pay from and your receipts. We never see or store your PIN.",
        "Usage: the pages you visit and homes you look at, so we can improve Instayhomes.",
        "Messages to our team: what you send us when you ask for help.",
      ],
    },
    {
      id: "how-we-use-it",
      title: "How we use it",
      list: [
        "To run your account and your plan.",
        "To send your receipts and important updates about your account.",
        "To help you when you contact us.",
        "To keep Instayhomes safe, for example by spotting fake listings.",
      ],
    },
    {
      id: "who-we-share-it-with",
      title: "Who we share it with",
      paragraphs: [
        "Mobile money providers, to take your payment. Service providers who help us run Instayhomes, such as hosting and email, under contracts that protect your data.",
        "We never sell your data. We only share it with anyone else if the law requires it. When you message a landlord, you choose what to send them on WhatsApp.",
      ],
    },
    {
      id: "how-long-we-keep-it",
      title: "How long we keep it",
      paragraphs: [
        "We keep your account details for as long as you have an account. We keep payment records for as long as the law requires for tax and accounting.",
      ],
    },
    {
      id: "your-rights",
      title: "Your rights",
      paragraphs: [
        "Under Zambia's Data Protection Act, you can ask to see the data we hold about you, correct it, or have it deleted. You can also object to how we use it.",
        "To do any of these, message our team or email us. We'll reply within 30 days.",
      ],
    },
    {
      id: "contact",
      title: "Contact us",
      paragraphs: [
        `Questions about your data? Email ${legalEmail} or message our team on WhatsApp.`,
      ],
    },
  ],
};
