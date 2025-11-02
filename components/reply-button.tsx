"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Compose from "@/components/compose";

interface ReplyButtonProps {
  postId: string;
  arcadeId?: string;
  onReply?: () => void;
}

export default function ReplyButton({ postId, arcadeId, onReply }: ReplyButtonProps) {
  const [showReply, setShowReply] = useState(false);
  const router = useRouter();

  const handlePost = () => {
    setShowReply(false);
    if (onReply) {
      onReply();
    } else {
      router.refresh();
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={() => setShowReply(!showReply)}
        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
      >
        {showReply ? "Cancel Reply" : "Reply"}
      </button>

      {showReply && (
        <div className="mt-3">
          <Compose parentId={postId} arcadeId={arcadeId} onPost={handlePost} />
        </div>
      )}
    </div>
  );
}
