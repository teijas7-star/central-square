import ArcadeHomePage from "@/components/arcade-home-page";

// Demo route to view the arcade home page
// Usage: /demo/arcade/[id] - Replace [id] with an actual arcade ID
export default function DemoArcadePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ArcadeHomePage params={params} />;
}

