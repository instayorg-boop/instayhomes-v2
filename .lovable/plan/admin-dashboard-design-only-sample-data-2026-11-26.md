# Admin dashboard (design only, sample data)

A separate admin area at `/admin` with its own left sidebar, no public header or footer. Every screen uses sample data. Buttons open forms and dialogs that change what you see in the browser, but nothing is saved.

## Pages

1. **Overview** (`/admin`)
   - Top numbers: active listings, rooms available, Plus subscribers this month, revenue this month (K / $), landlord contacts.
   - A simple subscribers-per-week chart, the best promo codes, and recent sign-ups.

2. **Listings** (`/admin/listings`)
   - A table of homes with photo, city, nearest university, gender (male/female/mixed), rooms available, status (live / hidden / draft), and a search box and filters.
   - Show or hide toggle on each row.
   - **Listing editor** (`/admin/listings/$id`): basics, location, universities with distances, amenities, house rules, general photos, and a **Rooms** section where each room has its own name, price, number available, availability date and photos. It also shows the property's total rooms available.

3. **Promo codes** (`/admin/promos`)
   - A table with code, discount (% or fixed), plans it applies to (Self-service, Assisted, International), uses / limit, subscribers, revenue, expiry and status.
   - "New promo code" dialog: code (with a generate button), discount type and value, plans, usage limit, start and end dates, and an optional partner or influencer it belongs to.
   - **Promo detail** (`/admin/promos/$code`): uses over time, how many people subscribed with it, revenue, plan split, and the list of people who used it (name, plan, date, amount).

4. **Subscribers** (`/admin/subscribers`)
   - Plus subscribers with plan, promo code used, start date, days left of 30, and status. Filter by plan or promo code.

5. **Blog posts** (`/admin/blog`)
   - A list of posts with status (published / draft), category and date.
   - **Post editor** (`/admin/blog/$slug`): title, short summary, cover image, category, body editor, and publish or save-as-draft buttons.

## Look
- Same fonts and colours as the site: white surfaces, light grey panels and the brand pink for main actions.
- The sidebar becomes a slide-out menu on phones, and tables turn into stacked cards.
- Plain, direct labels such as "Hide listing", "Copy code" and "Who used this code".

## Technical details
- A `src/routes/admin.tsx` layout with the shadcn `Sidebar` and an `<Outlet />`, plus child routes `admin.index`, `admin.listings.index`, `admin.listings.$id`, `admin.promos.index`, `admin.promos.$code`, `admin.subscribers`, `admin.blog.index` and `admin.blog.$slug`.
- Sample data lives in `src/lib/admin-sample.ts`. It reuses the rooms from `listing.tsx`, the plans from `plus.ts` and the posts from `guides-content.ts`.
- The public header and footer are not changed. Admin pages get `noindex` in their page metadata.
- A small test covers the promo stats: a code's subscriber count and revenue add up from its uses.
- It isn't protected by a login yet. A real admin sign-in can come with Lovable Cloud later.
