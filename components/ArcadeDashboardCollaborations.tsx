"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Link2,
  Globe,
  Building2,
  ChevronRight,
} from "lucide-react";
import ArcadeDashboardLayout from "./ArcadeDashboardLayout";
import { SequentialBloomLogo } from "./CSLogos/animated-logos";

interface Collaboration {
  id: string;
  name: string;
  description: string;
  type: "global" | "local";
  status: "active" | "pending";
}

export default function ArcadeDashboardCollaborationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [arcadeId, setArcadeId] = useState<string>("");
  const [arcadeName, setArcadeName] = useState<string>("Central Square Arcade");
  const [city, setCity] = useState<string>("Boston, MA");
  const [loading, setLoading] = useState(true);

  const [collaborations] = useState<Collaboration[]>([
    {
      id: "1",
      name: "Climate Action Network",
      description: "Global collaboration on climate initiatives",
      type: "global",
      status: "active",
    },
    {
      id: "2",
      name: "Local Food Systems",
      description: "Regional food security partnership",
      type: "local",
      status: "active",
    },
  ]);

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setArcadeId(id);

      try {
        const arcadeRes = await fetch(`/api/arcades/${id}`, { cache: "no-store" });
        if (arcadeRes.ok) {
          const arcadeData = await arcadeRes.json();
          setArcadeName(arcadeData.arcade.name);
          setCity("Boston, MA"); // City not available in Arcade model
        }
      } catch (error) {
        console.error("Failed to load arcade:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  return (
    <ArcadeDashboardLayout arcadeId={arcadeId} arcadeName={arcadeName} city={city}>
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2 flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <SequentialBloomLogo size={32} />
            </div>
            Collaborations
          </h2>
          <p className="text-neutral-600">Connect with other arcades and networks</p>
        </div>

        {/* Collaborations */}
        {collaborations.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-neutral-50">
            <p className="text-neutral-600">No collaborations yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collaborations.map((collab) => (
              <div key={collab.id} className="bg-white border border-neutral-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {collab.type === "global" ? (
                      <Globe className="w-6 h-6 text-neutral-600" />
                    ) : (
                      <Building2 className="w-6 h-6 text-neutral-600" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">{collab.name}</h3>
                      <p className="text-sm text-neutral-600">{collab.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    collab.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {collab.status}
                  </span>
                </div>
                <Link href={`/arcades/${arcadeId}/collaborations/${collab.id}`} className="text-sm text-neutral-600 hover:text-neutral-900 flex items-center">
                  View details <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </ArcadeDashboardLayout>
  );
}

