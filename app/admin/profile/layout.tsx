// import { createServerClient } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';

// export default async function ProfileLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // Pass URL, anon key, and cookies object
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     { cookies }
//   );

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   if (!session) {
//     redirect('/login'); // Adjust this to your login page's URL
//   }

//   return <>{children}</>;
// }
