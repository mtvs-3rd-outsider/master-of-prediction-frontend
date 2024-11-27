"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EditFeedForm from "@components/EditFeedForm";
import useUserStore from "@store/useUserStore";
import { sendMultipartForm } from "@/handler/fetch/axios";
import { getFeedById } from "@/handler/feedApi";
import { FeedResponseDTO } from "@components/types/feedResponseDTO";
import axios from "@/handler/fetch/axios";
interface EditFeedPageProps {
  feedId: string;
}

export default function EditFeedPage({ feedId }: EditFeedPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedData, setFeedData] = useState<FeedResponseDTO | null>(null);
  const userInfo = useUserStore((state) => state.userInfo);

  useEffect(() => {
    const loadFeedData = async () => {
      try {
        const data = await getFeedById(Number(feedId));
        setFeedData(data);
      } catch (error) {
        console.error("Error loading feed:", error);
        alert("피드 정보를 불러오는데 실패했습니다.");
        router.push("/");
      }
    };

    loadFeedData();
  }, [feedId, router]);

  const handleSubmit = async (
    content: string,
    media: File[],
    youtubeUrls: string[]
  ) => {
    if (!userInfo) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!feedData) {
      alert("피드 정보가 없습니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const updatedFeedData = {
        ...feedData,
        content,
        title: content.substring(0, 50),
        user: {
          userId: userInfo.id,
        },
        mediaFiles: feedData.mediaFiles.map(file => file.fileUrl),
        youTubeVideos: youtubeUrls // 새로운 YouTube URLs 직접 사용
      };

      formData.append(
        "feedData",
        new Blob([JSON.stringify(updatedFeedData)], {
          type: "application/json",
        })
      );

      media.forEach((file) => {
        formData.append("files", file);
      });

      youtubeUrls.forEach((url) => {
        formData.append("youtubeUrls", url);
      });

      // const response = await sendMultipartForm(`/feeds/${feedId}`, formData, 'put');
      const response = await axios.put(`/feeds/${feedId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status < 300) {
        router.push("/hot-topic");
      } else {
        throw new Error(response.data.message || "피드 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating feed:", error);
      alert(
        error instanceof Error ? error.message : "피드 수정에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!feedData) {
    return <div>Loading...</div>;
  }

  return (
    <EditFeedForm
      onSubmit={handleSubmit}
      initialData={feedData}
      isSubmitting={isSubmitting}
    />
  );
}
