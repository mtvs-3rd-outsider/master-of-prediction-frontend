"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { DatePicker } from "@nextui-org/date-picker";
import UserBanner from "@/components/user/UserBanner";
import {locations} from "./location";
import { CameraIcon } from '@heroicons/react/24/outline'; // 또는 '@heroicons/react/outline'
import Avatar from "@/components/AvatarWithIcon";
import BackButton from "@components/BackButton"
const ProfileEditPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("John Doe");
  const [username, setUsername] = useState("@johndoe");
  const [location, setLocation] = useState("New York, USA");
  const [website, setWebsite] = useState("https://johndoe.com");
  const [birthday, setBirthday] = useState("1990-01-01");
  const [gender, setGender] = useState("male");

  const handleSave = () => {
    // Save profile logic here
    alert("Profile updated successfully!");
    router.push("/profile");
  };



  return (
    <main className="col-span-5 w-full border-x border-slate-200">
      <div className="relative max-w-2xl mx-auto p-4">
        <div className="flex justify-center items-center ">
          <h1 className="font-bold mb-4 ">프로필 수정</h1>
        </div>
        <div className="absolute top-0 right-0 mb-4 p-4 flex justify-end w-full">
          <Button variant="light" className="font-bold text-sm mb-4 ">
            저장
          </Button>
        </div>
        <div className="absolute top-0 left-0 mb-4 p-4 flex justify-start w-full">
          <BackButton/>
        </div>
        <div className="sticky  overflow-hidden ">
          <UserBanner imageUrl="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2532&q=80" >
          <CameraIcon   className="w-12 h-12" color="white"  />
          </UserBanner>
        </div>
        <div
  className="relative left-4 top-[-40px] mb-1 h-10"
  style={{
    transformOrigin: "bottom center",
  }}
>
  <div className="relative">
    <Avatar
      alt="User Avatar"
      initials="RQ"
      size={80} // 아바타 크기를 동적으로 설정
    >
       <CameraIcon   className="w-12 h-12" color="white"  />
    </Avatar>
   
  </div>
</div>
        <form className="space-y-4">
          <Input
            type="text"
            label="Name"
            fullWidth={false}
            variant="underlined"
            // value={name}
            // onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Username"
            fullWidth={false}
            value={username}
            variant="underlined"
            onChange={(e) => setUsername(e.target.value)}
          />
            
          <Input
            label="Website"
            fullWidth
            value={website}
            variant="underlined"
            onChange={(e) => setWebsite(e.target.value)}
          />
            <Select 
        label="Select an location" 
        variant="underlined"
      >
        {locations.map((location) => (
          <SelectItem key={location.key}>
            {location.label}
          </SelectItem>
        ))}
      </Select>
          <DatePicker label="Birth date" variant="underlined" className="max-w-[284px]" />
          <div className="inline-flex gap-2">

          {/* <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label> */}
            <RadioGroup
              orientation="horizontal"
              value={gender}
              onValueChange={setGender}
            >
              <Radio value="male" size="sm">Male</Radio>
              <Radio value="female" size="sm">Female</Radio>
            </RadioGroup>
          </div>
          <div>

      
            </div>
         
        </form>
      </div>
    </main>
  );
};

export default ProfileEditPage;
