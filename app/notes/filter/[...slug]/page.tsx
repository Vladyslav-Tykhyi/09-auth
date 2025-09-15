import { fetchNotes } from "@/lib/api";
import NotesClient from "@/app/notes/filter/[...slug]/Notes.client";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tagFilter = resolvedParams.slug?.[0];

  let title = "All Notes | NoteHub";
  let description = "Browse all your notes in NoteHub application.";

  if (tagFilter) {
    title = `Notes filtered by: ${tagFilter} | NoteHub`;
    description = `Browse notes filtered by ${tagFilter} tag in NoteHub application.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/filter/${tagFilter || "all"}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
  };
}

export default async function NotesPage({
  params,
  searchParams,
}: NotesPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const page = parseInt(resolvedSearchParams.page || "1");
  const searchQuery = resolvedSearchParams.search || "";
  const tagFilter = resolvedParams.slug?.[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", page, searchQuery, tagFilter],
    queryFn: () => fetchNotes(page, 12, searchQuery, tagFilter),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        initialPage={page}
        initialSearchQuery={searchQuery}
        tagFilter={tagFilter}
      />
    </HydrationBoundary>
  );
}
