"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Pencil, Bot, ThumbsUp, HelpCircle } from "lucide-react";

interface ProfileSetupProps {
  userId: string;
  userEmail?: string;
}

export default function ProfileSetup({ userId, userEmail }: ProfileSetupProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedColorTheme, setSelectedColorTheme] = useState(1); // Index of selected color
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generate default handle from name or email
  useEffect(() => {
    if (name && !handle) {
      const generatedHandle = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .substring(0, 20);
      setHandle(generatedHandle);
    } else if (!name && !handle && userEmail) {
      // Fallback to email username if name not set
      const emailHandle = userEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "_");
      setHandle(emailHandle.substring(0, 20));
    }
  }, [name, handle, userEmail]);

  // Generate avatar seed for consistent avatar
  const avatarSeed = userId.substring(0, 8) || "default";

  const availableInterests = [
    "Urban Planning",
    "Climate",
    "AI Ethics",
    "Education",
    "Healthcare",
    "Transportation",
    "Housing",
    "Local Business",
    "Community Events",
  ];

  const colorThemes = [
    { bg: "bg-neutral-500", name: "Gray" },
    { bg: "bg-neutral-600", name: "Dark Gray" },
    { bg: "bg-neutral-500", name: "Medium Gray" },
    { bg: "bg-neutral-400", name: "Light Gray" },
    { bg: "bg-neutral-500", name: "Neutral" },
    { bg: "bg-neutral-600", name: "Charcoal" },
  ];

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else if (selectedInterests.length < 3) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleGenerateAvatar = () => {
    const newSeed = Math.random().toString(36).substring(2, 10);
    setAvatarUrl(`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${newSeed}`);
  };

  const handleUploadPhoto = () => {
    // Create a file input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In a real app, you'd upload to a storage service (Supabase Storage, etc.)
        // For now, we'll use a data URL
        const reader = new FileReader();
        reader.onload = (event) => {
          setAvatarUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name.trim()) {
      setError("Display name is required");
      setLoading(false);
      return;
    }

    if (!handle.trim()) {
      setError("Handle is required");
      setLoading(false);
      return;
    }

    // Use avatarUrl or generate one if not set
    const finalAvatarUrl = avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${avatarSeed}`;

    try {
      const res = await fetch("/api/profiles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          handle: handle.trim().toLowerCase(),
          avatarUrl: finalAvatarUrl,
          interests: selectedInterests,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Failed to create profile");
      }
    } catch (error) {
      setError("Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Create minimal profile with default values
    const defaultHandle = userEmail?.split("@")[0] || `user_${userId.substring(0, 8)}`;
    const defaultName = userEmail?.split("@")[0] || "User";
    const defaultAvatarUrl = `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${avatarSeed}`;

    fetch("/api/profiles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: defaultName,
        handle: defaultHandle.toLowerCase().replace(/[^a-z0-9_]/g, "_"),
        avatarUrl: defaultAvatarUrl,
        interests: [],
      }),
    }).then(() => {
      router.push("/dashboard");
    });
  };

  const currentAvatarUrl = avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${avatarSeed}`;

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-8 px-6">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-neutral-700 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-neutral-900">Central Square</span>
          </div>
          <div className="w-16 h-1 bg-neutral-300 mx-auto rounded-full">
            <div className="w-12 h-1 bg-neutral-900 rounded-full"></div>
          </div>
          <p className="text-sm text-neutral-500 mt-2">Step 3 of 3</p>
        </div>

        {/* Main Onboarding Card */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 md:p-8 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-neutral-900 mb-3">Complete Your Profile</h1>
            <p className="text-neutral-600">
              Choose your display name, profile image, and interests to personalize your Central Square experience.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Profile Image Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-neutral-700 mb-4">Profile Image</label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-neutral-200 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src={currentAvatarUrl}
                      alt="Profile avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleUploadPhoto}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-neutral-900 text-white rounded-full flex items-center justify-center hover:bg-neutral-800 transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleGenerateAvatar}
                    className="text-sm text-neutral-600 hover:text-neutral-900 mb-2 block transition-colors"
                  >
                    Generate New Avatar
                  </button>
                  <button
                    type="button"
                    onClick={handleUploadPhoto}
                    className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Upload Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Display Name Section */}
            <div className="mb-8">
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                Display Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg py-3 px-4 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                placeholder="Enter your display name"
              />
              <p className="text-xs text-neutral-500 mt-1">
                This is how other community members will see you
              </p>
            </div>

            {/* Handle Section (auto-generated, hidden from user) */}
            <input
              type="hidden"
              value={handle || ""}
              required
              minLength={3}
              maxLength={30}
            />

            {/* Interests Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-neutral-700 mb-4">
                Select Your Interests (up to 3)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableInterests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      disabled={!isSelected && selectedInterests.length >= 3}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        isSelected
                          ? "bg-neutral-900 text-white hover:bg-neutral-800"
                          : "border border-neutral-200 text-neutral-700 hover:border-neutral-900 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                {selectedInterests.length} of 3 selected
              </p>
            </div>

            {/* Avatar Color Theme Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-neutral-700 mb-4">
                Choose Avatar Color Theme
              </label>
              <div className="flex items-center space-x-3">
                {colorThemes.map((theme, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedColorTheme(index)}
                    className={`w-12 h-12 ${theme.bg} rounded-lg border-2 transition-all ${
                      selectedColorTheme === index
                        ? "border-neutral-900"
                        : "border-transparent hover:border-neutral-300"
                    }`}
                    title={theme.name}
                  />
                ))}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Action Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full bg-neutral-900 text-white py-3 rounded-lg hover:bg-neutral-800 transition-colors text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Profile..." : "Enter Central Square"}
              </button>
            </div>
          </form>
        </div>

        {/* AI Host Message */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-neutral-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-neutral-900">AI Host</span>
                <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
                  Guide
                </span>
              </div>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Hi {name || "there"}! I'm your guide for Central Square. I'll help you discover relevant discussions, connect with like-minded community members, and ensure conversations stay constructive and meaningful. Welcome to your digital public square!
              </p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-neutral-500">
                <button
                  type="button"
                  className="flex items-center space-x-1 hover:text-neutral-700 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful</span>
                </button>
                <Link
                  href="/ai-host"
                  className="flex items-center space-x-1 hover:text-neutral-700 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Learn More</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Skip for now, I'll complete this later
          </button>
        </div>
      </div>
    </div>
  );
}

