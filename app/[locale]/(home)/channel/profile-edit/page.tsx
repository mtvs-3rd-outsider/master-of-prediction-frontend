"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { DatePicker } from "@nextui-org/date-picker";
import UserBanner from "@components/user/UserBanner";
import { locations } from "./location";
import { CameraIcon } from '@heroicons/react/24/outline'; 
import Avatar from "@components/AvatarWithIcon";
import BackButton from "@components/BackButton";
import { sendMultipartForm } from "@handler/fetch/axios";
import useUserStore, { UserInfo } from "@store/useUserStore";
import apiClient  from "@handler/fetch/axios";
import { stat } from "fs";
import useOptimisticMutation from "@handler/useOptimisticMutation";
import {parseDate, getLocalTimeZone,CalendarDate} from "@internationalized/date";
// Mock fetch function to get user profile data
import {useDateFormatter} from "@react-aria/i18n";
import { set } from "lodash";
import {urlToFile, fetchImageUrl} from "@handler/fetch/img";
import {Textarea} from "@nextui-org/input";
import toast from "react-hot-toast";
  // 사용 예시

  
const ProfileEditPage: React.FC =  () => {

  const fetchUserProfile = async (userId: string | undefined ) => {
    const response = await apiClient.get(`/my-channel/${userId}`);
    if (!response.data) {
      throw new Error("Failed to fetch profile data");
    }
    return response.data;
  };

  const router = useRouter();
  const userInfo = useUserStore((state) => state.userInfo);
  
  // Fetch user profile data using useQuery
  console.log("userInfo:", userInfo);
  const userId= userInfo?.id;
  const { isPending, error, data: userProfile } = useQuery({
    queryKey: ['my-channel'],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,  // 5분 동안 데이터가 fresh 상태로 유지
  });
  console.log("userProfile:", userProfile);

  const mutation = useOptimisticMutation({
    queryKey: ['my-channel'], // 쿼리 키를 명확하게 설정
    mutationFn: (formData: FormData) => sendMultipartForm(`/users/${userId}`, formData, 'put'),
    onErrorFn: (error: any, context: any) => {
      console.error('Mutation failed:', error);
      if (context?.previousData) {
        const updateUserInfo = useUserStore.getState().updateUserInfo;
        updateUserInfo(context.previousData);
      }
    },
    onSuccessFn:  async (data: any, variables: any, context: any) => {
      toast.success("Profile updated successfully!");
      
      // 데이터를 바로 업데이트
      const userInfoResponse = await apiClient.get(`/auth/users`);
      const updateUserInfo = useUserStore.getState().updateUserInfo;
      updateUserInfo(userInfoResponse.data);
    
      // 페이지 이동 처리
      if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back();
      } else {
        router.push('/'); // 기본 페이지로 이동
      }
    }
  });
  let formatter = useDateFormatter({dateStyle: "full"});
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [birthday, setBirthday] = useState<CalendarDate | null>(null); // Date 타입에서 string으로 변경
  const [gender, setGender] = useState("male");
  const [bannerImage, setBannerImage] = useState<File | null>(null); // 이미지 파일 저장
  const [avatarImage, setAvatarImage] = useState<File | null>(null);  // 이미지 파일 저장

  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (userProfile) {
      // 기본 프로필 정보 설정
      setDisplayName(userProfile.display_name || "");
      setUsername(userProfile.user_name || "");
      setLocation(userProfile.user_location || "");
      setWebsite(userProfile.website || "");
      setBio(userProfile.bio || "");
      setBirthday(userProfile.birthday ? parseDate(userProfile.birthday) : null);
      setGender(userProfile.user_gender?.toLowerCase() || "male");
  
      // user_img 처리
      if (userProfile.user_img) {
     urlToFile(userProfile.user_img) // URL을 File로 변환
          .then((file) => {
            console.log(file);  // File 객체로 출력
            setAvatarImage(file); // File 상태로 설정
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
  
      // banner_img 처리
      if (userProfile.banner_img) {
       urlToFile(userProfile.banner_img) // URL을 File로 변환
          .then((file) => {
            console.log(file);  // File 객체로 출력
            setBannerImage(file); // File 상태로 설정
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
  }, [userProfile]);
  const handleBannerClick = () => {
    if (bannerInputRef.current) {
      bannerInputRef.current.click();
    }
  };

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBannerImage(file); // 선택된 파일을 상태로 저장
    }
  };

  const handleAvatarClick = () => {
    if (avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarImage(file); // 선택된 파일을 상태로 저장
    }
  };
  const handleSelectionChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value);
  };
  // 프로필 저장 핸들러
  const handleSave = async () => {
    try {
      const formData = new FormData();

     if (displayName.trim() !== "") {
       formData.append("displayName", displayName);
     }

     if (username.trim() !== "") {
       formData.append("userName", username);
     }

     if (location.trim() !== "") {
       formData.append("location", location);
     }

     if (website.trim() !== "") {
       formData.append("website", website);
     }

     if (bio.trim() !== "") {
       formData.append("bio", bio);
     }

      if (birthday) {
        formData.append("birthday", birthday.toString());
      }
      formData.append("gender", gender);

      // 이미지 파일이 있는 경우 추가
      if (bannerImage) {
        formData.append("bannerImage", bannerImage);
      }
      if (avatarImage) {
        formData.append("avatarImage", avatarImage);
      }

      mutation.mutate(formData);

   
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Error updating profile.");
    }
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading profile data.</div>;
  }

  return (
    <main className="col-span-5 w-full border-x border-slate-200">
      <div className="relative max-w-2xl mx-auto p-4">
        <div className="flex justify-center items-center ">
          <h1 className="font-bold mb-4 ">프로필 수정</h1>
        </div>
        <div>
        <div className="absolute  top-0 right-0 mb-4 p-4 flex justify-end w-auto">
          <Button variant="light" className="font-bold text-sm mb-4 " onClick={handleSave}>
            저장
          </Button>
        </div>
        <div className="absolute    top-0 left-0 mb-4 p-4 flex justify-start w-auto">
          <BackButton />
        </div>
        <div className="sticky overflow-hidden ">
          <div onClick={handleBannerClick} className="cursor-pointer">
            <UserBanner imageUrl={bannerImage ? URL.createObjectURL(bannerImage) : undefined}>
              <CameraIcon className="w-12 h-12" color="white" />
            </UserBanner>
          </div>
          </div>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerChange}
          />
        </div>
        <div
          className="relative left-4 top-[-40px] mb-1 h-10"
          style={{
            transformOrigin: "bottom center",
          }}
        >
          <div className="relative cursor-pointer" onClick={handleAvatarClick}>
            <Avatar alt="User Avatar" initials="RQ" size={80} src={avatarImage ? URL.createObjectURL(avatarImage) : undefined}>
              <CameraIcon className="w-12 h-12" color="white" />
            </Avatar>
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <form className="space-y-4">
          <Input
            type="text"
            label="Name"
            fullWidth={false}
            variant="underlined"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Input
            label="Username"
            fullWidth={false}
            value={username}
            variant="underlined"
            onChange={(e) => setUsername(e.target.value)}
          />
           <Textarea
            label="Bio"
            fullWidth={false}
            value={bio}
            variant="underlined"
            onChange={(e) => setBio(e.target.value)}
          />
          <Input
            label="Website"
            fullWidth
            value={website}
            variant="underlined"
            onChange={(e) => setWebsite(e.target.value)}
          />
          <Select label="Select an location" variant="underlined"
               selectedKeys={[location]}// 선택된 값을 표시
               onChange={handleSelectionChange}
          >
            {locations.map((location) => (
              <SelectItem key={location.key}>{location.label}</SelectItem>
            ))}
          </Select>
          <DatePicker label="Birth date" variant="underlined" className="max-w-[284px]"   value={birthday} onChange={setBirthday}/>
          <div className="inline-flex gap-2">
            <RadioGroup
              orientation="horizontal"
              value={gender}
              onValueChange={setGender}
            >
              <Radio value="male" size="sm">Male</Radio>
              <Radio value="female" size="sm">Female</Radio>
            </RadioGroup>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ProfileEditPage;
