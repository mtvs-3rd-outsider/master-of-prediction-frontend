"use client";
import { useState, useRef } from "react";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { CameraIcon, MinusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import apiClient from "@handler/fetch/axios";
import { useRouter } from "next/navigation";


export default function Component() {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState<string[]>([]);
  const [ruleInput, setRuleInput] = useState("");
  const maxLines = 5;

  const handleDescriptionChange = (e: string) => {
    const inputValue = e;
    const lines = inputValue.split("\n").length;

    if (lines <= maxLines) {
      setDescription(inputValue);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isBanner = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isBanner) {
        setBannerFile(file);
        const bannerPreviewUrl = URL.createObjectURL(file);
        setBannerPreview(bannerPreviewUrl);
      } else {
        setSelectedFile(file);
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
      }
    }
  };

  const handleButtonClick = (isBanner = false) => {
    if (isBanner) {
      bannerInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleAddRule = () => {
    if (ruleInput.trim() !== "") {
      setRules((prevRules) => [...prevRules, ruleInput]);
      setRuleInput("");
    }
  };

  const handleDeleteRule = (index: number) => {
    setRules((prevRules) => prevRules.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    
    formData.append("displayName", title);
    formData.append("description", description);
    formData.append("communityRule", JSON.stringify(rules));
    
    if (selectedFile) {
      formData.append("representativeImage", selectedFile);
    }

    if (bannerFile) {
      formData.append("bannerImage", bannerFile);
    }

    try {
      const response = await apiClient.post("/category-channels/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        // 성공 처리
        alert("채널 등록 신청이 완료되었습니다.");
        router.push("/category-channel/")
      } else {
        // 오류 처리
        alert("채널 등록 신청에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("서버 오류로 인해 채널 등록 신청에 실패했습니다.");
    }
  };

  return (
    <main className="col-span-5 w-full border-x">
      <div className="max-w-lg mx-auto p-4 space-y-6">
        <h1 className="text-xl font-bold">채널 등록 신청하기</h1>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="채널 이름을 입력하세요"
          fullWidth
        />

        <div className="space-y-2">
          <h2 className="font-semibold">대표 이미지 (정비율)</h2>
          <p className="text-sm text-muted-foreground">
            대표 이미지는 1개, 15MB 이하입니다.
          </p>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e)}
            style={{ display: "none" }}
          />

          <div
            className="w-[100px] h-[100px] mt-4 border rounded flex items-center justify-center cursor-pointer"
            onClick={() => handleButtonClick(false)}
          >
            {preview ? (
              <img
                src={preview}
                alt="Selected preview"
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded bg-gray-200">
                <CameraIcon className="h-8 w-8 text-gray-500" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold">배너 이미지 (3:1 비율)</h2>
          <p className="text-sm text-muted-foreground">
            배너 이미지는 1개, 15MB 이하입니다.
          </p>

          <input
            type="file"
            accept="image/*"
            ref={bannerInputRef}
            onChange={(e) => handleFileChange(e, true)}
            style={{ display: "none" }}
          />
          <div
            className="relative w-full mt-4 border rounded overflow-hidden cursor-pointer"
            style={{ paddingTop: "33.33%", minHeight: "150px" }} // 3:1 aspect ratio, ensuring minimum height
            onClick={() => handleButtonClick(true)}
          >
            {bannerPreview ? (
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="absolute top-0 left-0 w-full h-full object-cover rounded"
              />
            ) : (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200">
                <CameraIcon className="h-14 w-14 text-gray-500" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold">채널 설명</h2>
          <p className="text-sm text-muted-foreground">
            등록하시는 채널에 대해 설명해주세요!
          </p>
          <Textarea
            placeholder="채널 설명을 입력하세요."
            fullWidth
            maxRows={3}
            minRows={3}
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold">채널 규칙</h2>
          <p className="text-sm text-muted-foreground">
            채널 규칙을 입력해주세요.
          </p>
          <div className="flex items-center space-x-2">
            <MinusCircleIcon className="w-6 h-6 text-red-500" />
            <Input
              value={ruleInput}
              onChange={(e) => setRuleInput(e.target.value)}
              placeholder="1번 규칙 입력해주세요"
              fullWidth
            />
            <Button
              className="p-2"
              variant="bordered"
              color="secondary"
              onClick={handleAddRule}
            >
              규칙 생성
            </Button>
          </div>

          <ul className="mt-4 space-y-2">
            {rules.map((rule, index) => (
              <li key={index} className="flex items-center space-x-2">
                <MinusCircleIcon className="w-5 h-5 text-red-500" />
                <span>
                  {index + 1}. {rule}
                </span>
                <button
                  className="ml-auto text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteRule(index)}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center">
          <Button
            className="w-10 p-3"
            fullWidth
            color="primary"
            onClick={handleSubmit}
          >
            채널 등록 신청하기
          </Button>
        </div>
      </div>
    </main>
  );
}
