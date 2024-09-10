"use client";
import { useState, useRef } from "react";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { CameraIcon, MinusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Component() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState<string[]>([]); // 규칙 리스트 상태
  const [ruleInput, setRuleInput] = useState(""); // 새 규칙 입력 상태
  const maxLines = 5;

  const handleDescriptionChange = (e: string) => {
    const inputValue = e;
    const lines = inputValue.split("\n").length;

    if (lines <= maxLines) {
      setDescription(inputValue);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 규칙 추가 핸들러
  const handleAddRule = () => {
    if (ruleInput.trim() !== "") {
      setRules((prevRules) => [...prevRules, ruleInput]); // 기존 규칙에 새 규칙 추가
      setRuleInput(""); // 입력 필드 초기화
    }
  };

  // 규칙 삭제 핸들러
  const handleDeleteRule = (index: number) => {
    setRules((prevRules) => prevRules.filter((_, i) => i !== index)); // 해당 규칙 삭제
  };

  return (
    <main className="col-span-5 w-full border-x">
      <div className="max-w-lg mx-auto p-4 space-y-6">
        <h1 className="text-xl font-bold">채널 등록 신청하기</h1>

        <div className="space-y-2">
          <h2 className="font-semibold">대표 이미지</h2>
          <p className="text-sm text-muted-foreground">대표 이미지는 1개, 15MB 이하입니다.</p>

          {/* Hidden input field for file */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div
            className="w-[50px] h-[50px] mt-4 border rounded flex items-center justify-center cursor-pointer"
            onClick={handleButtonClick}
          >
            {preview ? (
              <img
                src={preview}
                alt="Selected preview"
                className="w-[50px] h-[50px] object-cover rounded"
              />
            ) : (
              <div className="w-[50px] h-[50px] flex items-center justify-center rounded bg-gray-200">
                <CameraIcon className="h-6 w-6 text-gray-500" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold">채널 설명</h2>
          <p className="text-sm text-muted-foreground">등록하시는 채널에 대해 설명해주세요!</p>
          <Textarea
            placeholder="채널 설명을 입력하세요."
            fullWidth
            maxRows={3}
            minRows={3}
          />
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold">채널 규칙</h2>
          <p className="text-sm text-muted-foreground">채널 규칙을 입력해주세요.</p>
          <div className="flex items-center space-x-2">
            <MinusCircleIcon className="w-6 h-6 text-red-500" />
            <Input
              value={ruleInput} // 입력된 규칙을 상태로 관리
              onChange={(e) => setRuleInput(e.target.value)} // 입력 변화 처리
              placeholder="1번 규칙 입력해주세요"
              fullWidth
            />
            <Button
              className="p-2"
              variant="bordered"
              color="secondary"
              onClick={handleAddRule} // 규칙 추가 핸들러
            >
              규칙 생성
            </Button>
          </div>

          {/* 규칙 리스트를 화면에 출력 */}
          <ul className="mt-4 space-y-2">
            {rules.map((rule, index) => (
              <li key={index} className="flex items-center space-x-2">
                <MinusCircleIcon className="w-5 h-5 text-red-500" />
                <span>{index + 1}. {rule}</span>
                <button
                  className="ml-auto text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteRule(index)} // 규칙 삭제 핸들러 호출
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center">
          <Button className="w-10 p-3" fullWidth color="primary">
            채널 등록 신청하기
          </Button>
        </div>
      </div>
    </main>
  );
}
