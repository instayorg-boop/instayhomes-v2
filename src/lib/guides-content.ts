// Written guides for the blog (/blog and /blog/<slug>). Slugs match the guide links on the search
// page (see guides.ts), so those links open the real article. A slug with no entry here still
// shows the "coming soon" page.
import { slugify } from "@/lib/guides";

export type GuideCategory =
  "Renting safely" | "Moving to uni" | "Money" | "Housemates" | "Using Instayhomes";

/** One block of an article body. */
export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  /** A numbered list where each item starts with a bold lead-in. */
  | { type: "steps"; items: { lead: string; text: string }[] }
  /** A list with green ticks. */
  | { type: "checklist"; items: string[] }
  | { type: "quote"; text: string };

export type Guide = {
  slug: string;
  title: string;
  /** One-line summary under the title, also used on cards. */
  dek: string;
  category: GuideCategory;
  minutes: number;
  /** ISO date. */
  published: string;
  image: string;
  imageAlt: string;
  /** Three-bullet "In short" summary at the top of the article. */
  inShort: string[];
  body: GuideBlock[];
};

const photo = (id: string, width = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const guideCategories: GuideCategory[] = [
  "Renting safely",
  "Moving to uni",
  "Money",
  "Housemates",
  "Using Instayhomes",
];

const guide = (g: Omit<Guide, "slug">): Guide => ({ ...g, slug: slugify(g.title) });

export const guides: Guide[] = [
  guide({
    title: "How to spot a rental scam",
    dek: "Five warning signs, and what to check before you pay anything.",
    category: "Renting safely",
    minutes: 6,
    published: "2026-11-12",
    image: photo("photo-1616594039964-ae9021a400a0"),
    imageAlt: "A furnished bedroom",
    inShort: [
      "Never pay before you've seen the room.",
      "Check the payment name matches the landlord.",
      "If someone rushes you, slow down.",
    ],
    body: [
      {
        type: "p",
        text: "Most rooms advertised to students are real. But every year some students lose a deposit to someone who doesn't own the room. Scams nearly always follow the same pattern, and a few checks stop almost all of them.",
      },
      { type: "h2", text: "Five warning signs" },
      {
        type: "steps",
        items: [
          {
            lead: "They want money before a viewing.",
            text: 'A "holding fee" by mobile money before you\'ve seen the room is the most common trick.',
          },
          {
            lead: "The price is far below the area.",
            text: "If a room near campus costs half what others do, ask why.",
          },
          {
            lead: "They won't meet or video call.",
            text: 'Someone who is always "travelling" and can only text is a red flag.',
          },
          {
            lead: "They rush you.",
            text: '"Five other students want it, pay today" is pressure, not information.',
          },
          {
            lead: "The payment name doesn't match.",
            text: "If the mobile money account is in someone else's name, stop.",
          },
        ],
      },
      {
        type: "quote",
        text: "Never pay a deposit before you've seen the room and met the landlord, in person or on a video call.",
      },
      { type: "h2", text: "What to check before you pay" },
      {
        type: "checklist",
        items: [
          "Visit the room, or ask for a live video walk-through.",
          "Ask for the landlord's NRC and check it matches the payment account.",
          "Get the rent, deposit and move-in date in writing.",
          "Ask a current or past tenant what it's like to live there.",
        ],
      },
      { type: "h2", text: "If something feels wrong" },
      {
        type: "p",
        text: "Stop and don't send money. If you found the home on Instayhomes, report it from the listing or message our team on WhatsApp. Tenant Protection means you're eligible for a full refund or free unlock credit if a listing is fake or not as shown.",
      },
    ],
  }),
  guide({
    title: "Questions to ask a landlord on WhatsApp",
    dek: "What to ask before a viewing, so there are no surprises on move-in day.",
    category: "Renting safely",
    minutes: 4,
    published: "2026-11-08",
    image: photo("photo-1560448204-e02f11c3d0e2"),
    imageAlt: "A bright open-plan living room",
    inShort: [
      "Ask what the rent includes.",
      "Agree the deposit and when it's paid back.",
      "Book a viewing before anything else.",
    ],
    body: [
      {
        type: "p",
        text: "Your first message sets the tone. Be clear about who you are and when you want to move in, then ask the questions that decide whether the room works for you.",
      },
      { type: "h2", text: "Start with the basics" },
      {
        type: "steps",
        items: [
          {
            lead: "Is the room still available for my dates?",
            text: "Give your move-in month and how long you'll stay.",
          },
          {
            lead: "What does the rent include?",
            text: "Water, electricity, Wi-Fi and cleaning are often extra. Ask for a rough monthly total.",
          },
          {
            lead: "How much is the deposit, and when do I get it back?",
            text: "Ask what could be taken from it.",
          },
          {
            lead: "Who else lives there?",
            text: "How many housemates, and are they students too?",
          },
          {
            lead: "When can I see it?",
            text: "In person, or on a live video call if you're not in town yet.",
          },
        ],
      },
      {
        type: "quote",
        text: "A landlord who answers clearly in writing is usually a landlord who will be easy to live with.",
      },
      { type: "h2", text: "Before you agree" },
      {
        type: "checklist",
        items: [
          "Keep the whole conversation in one WhatsApp chat, so you have a record.",
          "Ask for the agreement in writing before you pay anything.",
          "Check the name on the payment account matches the landlord.",
        ],
      },
    ],
  }),
  guide({
    title: "What to check before you rent",
    dek: "A viewing checklist for water, power, security and the walk to campus.",
    category: "Renting safely",
    minutes: 6,
    published: "2026-11-02",
    image: photo("photo-1505693416388-ac5ce068fe85"),
    imageAlt: "A double bedroom with bedside tables",
    inShort: [
      "Turn on the taps and the lights.",
      "Check the locks, doors and windows.",
      "Walk or ride the route to campus.",
    ],
    body: [
      {
        type: "p",
        text: "A viewing is your chance to see what the photos don't show. Take your time, and don't be shy about opening cupboards and turning things on.",
      },
      { type: "h2", text: "In the room" },
      {
        type: "checklist",
        items: [
          "Turn on the taps and shower. Is there water, and is it hot?",
          "Switch on the lights and sockets. Ask how often the power goes off.",
          "Check the door and window locks work.",
          "Look for damp, cracks and signs of insects.",
          "Make sure the bed, desk and storage listed are really there.",
        ],
      },
      { type: "h2", text: "Around the home" },
      {
        type: "checklist",
        items: [
          "Is there a security guard, wall or gate at night?",
          "Is the kitchen shared, and how many people use it?",
          "Is there space to study quietly?",
        ],
      },
      { type: "h2", text: "Getting to campus" },
      {
        type: "p",
        text: "Do the trip at the time you'd leave for a morning lecture. A room that's cheap but an hour away can cost more in transport than you save.",
      },
    ],
  }),
  guide({
    title: "Moving to university in Zambia",
    dek: "What to sort out before you arrive, from your room to your first week.",
    category: "Moving to uni",
    minutes: 5,
    published: "2026-10-28",
    image: photo("photo-1522071820081-009f0129c71c"),
    imageAlt: "Students working together at a table",
    inShort: [
      "Find your room before you travel.",
      "Bring documents and a little cash.",
      "Plan your first week around registration.",
    ],
    body: [
      {
        type: "p",
        text: "Moving away for university is exciting and a lot to organise. Getting your room sorted early makes everything else easier.",
      },
      { type: "h2", text: "Before you travel" },
      {
        type: "steps",
        items: [
          {
            lead: "Find your room.",
            text: "Start looking a month or two before term, when there's the most choice.",
          },
          {
            lead: "Agree your move-in date in writing.",
            text: "Make sure the room will be ready the day you arrive.",
          },
          {
            lead: "Pack your documents.",
            text: "Your NRC, admission letter and any payment receipts.",
          },
        ],
      },
      { type: "h2", text: "Your first week" },
      {
        type: "checklist",
        items: [
          "Register at the university and get your student ID.",
          "Walk the route between your room and your lecture halls.",
          "Agree house rules with your housemates early.",
        ],
      },
    ],
  }),
  guide({
    title: "Budgeting for your first year away from home",
    dek: "Rent is only part of it. Here's how to plan the rest of your money.",
    category: "Money",
    minutes: 7,
    published: "2026-10-20",
    image: photo("photo-1560185127-6ed189bf02f4"),
    imageAlt: "A shared lounge",
    inShort: [
      "List every monthly cost, not only rent.",
      "Keep a small emergency fund.",
      "Check your spending every month.",
    ],
    body: [
      {
        type: "p",
        text: "Most students budget for rent and forget everything around it. A simple monthly plan stops the money running out before the term does.",
      },
      { type: "h2", text: "Costs to plan for" },
      {
        type: "checklist",
        items: [
          "Rent, and the deposit up front.",
          "Electricity, water and Wi-Fi if they're not included.",
          "Food and cooking gas.",
          "Transport to campus.",
          "Data and airtime.",
          "Books, printing and stationery.",
        ],
      },
      {
        type: "quote",
        text: "Put a little aside every month for the things you didn't plan for. Something always comes up.",
      },
      { type: "h2", text: "Make it stick" },
      {
        type: "p",
        text: "Write your plan down, check it at the end of every month, and adjust. Sharing big costs such as gas and Wi-Fi with housemates is one of the easiest ways to save.",
      },
    ],
  }),
  guide({
    title: "Shared housing: what to agree with housemates",
    dek: "Five things to agree on in week one, so the rest of the year is easy.",
    category: "Housemates",
    minutes: 5,
    published: "2026-10-14",
    image: photo("photo-1560185008-b033106af5c3"),
    imageAlt: "A shared dining area",
    inShort: [
      "Split bills fairly and in writing.",
      "Agree a cleaning rota.",
      "Talk about guests and quiet hours.",
    ],
    body: [
      {
        type: "p",
        text: "Most housemate problems come from things nobody talked about. A short conversation in your first week saves a lot of arguments later.",
      },
      { type: "h2", text: "Five things to agree" },
      {
        type: "steps",
        items: [
          { lead: "Bills.", text: "Who pays what, and when. Keep a shared note of payments." },
          { lead: "Cleaning.", text: "A simple weekly rota for the kitchen, bathroom and bins." },
          { lead: "Food.", text: "What's shared and what isn't." },
          { lead: "Guests.", text: "How often, and whether they can stay over." },
          { lead: "Quiet hours.", text: "Especially before exams." },
        ],
      },
      {
        type: "quote",
        text: "Write your agreement down and put it somewhere everyone can see it.",
      },
    ],
  }),
  guide({
    title: "How Instayhomes Plus works",
    dek: "One payment, 30 days to message every landlord on WhatsApp.",
    category: "Using Instayhomes",
    minutes: 3,
    published: "2026-10-06",
    image: photo("photo-1600607687939-ce8a6c25118c"),
    imageAlt: "A modern living room",
    inShort: [
      "Browsing is always free.",
      "One payment unlocks every landlord for 30 days.",
      "Tenant Protection comes with every plan.",
    ],
    body: [
      {
        type: "p",
        text: "You can browse every home on Instayhomes for free. When you find one you like, Instayhomes Plus lets you message the landlord on WhatsApp.",
      },
      { type: "h2", text: "The plans" },
      {
        type: "steps",
        items: [
          {
            lead: "Self-service, K199.",
            text: "Message every landlord on Instayhomes for 30 days.",
          },
          {
            lead: "Assisted, K399.",
            text: "Everything in Self-service, plus an Instayhomes agent who helps you shortlist rooms and arrange viewings.",
          },
          {
            lead: "International, $50.",
            text: "For students moving from abroad. Talk to our team first, and you're invoiced once you've chosen a home.",
          },
        ],
      },
      { type: "h2", text: "Paying" },
      {
        type: "p",
        text: "Pay with Airtel Money, MTN MoMo or Zamtel Kwacha. As soon as the payment goes through, WhatsApp opens with your message to the landlord ready to send.",
      },
      {
        type: "quote",
        text: "If a listing is fake, already taken or not as advertised, Tenant Protection means you're eligible for a full refund or free unlock credit.",
      },
    ],
  }),
];

export const guideBySlug = (slug: string) => guides.find((g) => g.slug === slug) ?? null;

/** "12 Nov 2026". */
export const formatGuideDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/** Other guides to read next: same category first, then the newest. */
export function relatedGuides(current: Guide, count = 2) {
  const others = guides.filter((g) => g.slug !== current.slug);
  return [
    ...others.filter((g) => g.category === current.category),
    ...others.filter((g) => g.category !== current.category),
  ].slice(0, count);
}
