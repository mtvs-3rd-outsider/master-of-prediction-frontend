// pages/login.js
"use client";
import useUserStore from "@store/useUserStore";
import Head from "next/head";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { NextApiRequest, NextApiResponse } from "next";
import apiClient from "@handler/fetch/axios";
import toast, { Toaster } from 'react-hot-toast';
import GoogleButton from '@ui/GoogleButton';

export default function LoginPage() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<String | null>(null);
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // 로그인 요청
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      // 쿠키에서 액세스 토큰을 가져옴
      const accessToken = response.data.token;
      console.log("Login successful:", accessToken);
      console.log("Login successful:", response.data);

      const { id } = response.data;

      // // 사용자 정보 요청

      // Zustand 스토어에 userInfo를 저장
      const setUserInfo = useUserStore.getState().setUserInfo;
      // const userInfoWithToken = {
      //   ...userInfoResponse.data, // 기존 사용자 정보
      //   token: accessToken, // 토큰 추가
      // };
      setUserInfo(response.data);

      // 홈 페이지로 리다이렉트
      router.push("/");
    } catch {
      toast.error("인증 실패했습니다");
    }
 
  };

   const handleGoogleLogin = () => {
    router.push(process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL!);

    
  };

  return (
    <main className=" w-full border-x border-slate-200">

    <Toaster /> 
      <section className="flex flex-col md:flex-row h-screen items-center w-full">
        <div className="bg-blue-600 hidden lg:block lg:w-1/2 xl:w-2/3 h-full relative">
          <Image
            src="/images/login-bg.webp"
            alt="Background Image"
            className="w-full h-full object-cover"
            layout="fill" // 또는 width와 height를 지정하세요.
          />
        </div>

        <div className="bg-white w-full md:w-1/2 xl:w-1/3 h-full flex items-center justify-center px-6 lg:px-16 xl:px-12">
          <div className="w-full max-w-md">
            <Link href={"/"}>
              <Button variant="light" size="lg" className="p-2 font-bold">
                예측의 달인{" "}
              </Button>
            </Link>
            <form className="mt-6" onSubmit={handleSubmit}>
              <div>
                {/* <label className="block text-gray-700">Email Address</label> */}
                <Input
                  isRequired
                  type="email"
                  label="Email"
                  autoFocus
                  errorMessage="Please enter a valid email"
                  autoComplete="on"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mt-4">
                <Input
                  isRequired
                  label="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500 mt-2">{error}</p>}
              <div className="text-right mt-2">
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
              >
                Log In
              </Button>
            </form>

            <hr className="my-6 border-gray-300 w-full" />
            <GoogleButton onClick={handleGoogleLogin} mode="signin" />

            <p className="mt-8">
              Need an account?
              <Link
                href="/signin"
                className="text-blue-500 hover:text-blue-700 font-semibold"
              >
                Create an account
              </Link>
            </p>

            <p className="text-sm text-gray-500 mt-12">
              &copy; 2024 예측의 달인 - All Rights Reserved.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
