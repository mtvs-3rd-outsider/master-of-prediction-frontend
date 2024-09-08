// app/profile/ProfileForm.tsx
"use client";  // 클라이언트 컴포넌트로 선언

import { useState, useRef, useEffect } from "react";
import { Input, Button, Select, SelectItem, RadioGroup, Radio, DatePicker } from "@nextui-org/input";

export default function ProfileForm({ userProfile }) {
  const [name, setName] = useState(userProfile?.name || "");
  const [username, setUsername] = useState(userProfile?.userName || "");
  const [location, setLocation] = useState(userProfile?.location || "");
  const [website, setWebsite] = useState(userProfile?.website || "");
  const [birthday, setBirthday] = useState(userProfile?.birthday || "1990-01-01");
  const [gender, setGender] = useState(userProfile?.gender || "male");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [avatarImage, setAvatarImage] = useState<File | null>(null);

  const handleSave = async () => {
    // 저장 로직
    alert('Saved!');
  };

  return (
    <form className="space-y-4">
      <Input
        type="text"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="text"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        type="text"
        label="Website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <DatePicker
        label="Birthday"
        value={birthday}
        onChange={(date) => setBirthday(date)}
      />
      <RadioGroup
        value={gender}
        onChange={setGender}
      >
        <Radio value="male">Male</Radio>
        <Radio value="female">Female</Radio>
      </RadioGroup>
      <Button onClick={handleSave}>Save</Button>
    </form>
  );
}
