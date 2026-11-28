
import { Suspense } from "react";
import ProjectDetailsClient from "./project-details-client";

interface ProjectDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function ProjectDetailsContent({
  params,
}: ProjectDetailsPageProps) {
  const { id } = await params;

  return <ProjectDetailsClient projectId={Number(id)} />;
}

export default function ProjectDetailsPage({
  params,
}: ProjectDetailsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-6 py-10 text-center text-gray-400">
          Loading project...
        </div>
      }
    >
      <ProjectDetailsContent params={params} />
    </Suspense>
  );
}
