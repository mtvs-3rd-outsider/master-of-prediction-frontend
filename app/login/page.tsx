// pages/login.js
"use client";
import Head from 'next/head';
import {Input} from "@nextui-org/input"
import {Button} from "@nextui-org/button"
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { NextApiRequest, NextApiResponse } from 'next';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<String | null>(null);
  const router = useRouter();
  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    console.log(value)
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
  
    try {
      const response = await axios.post(
        'https://master-of-prediction.shop:8081/api/v1/auth/login',
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      const accessToken=  getCookie("accessToken")
      console.log('Login successful:', response.data);
      //     // 로그인 후 사용자 정보 API 호출
        const userInfoResponse = await axios.get(
            'https://master-of-prediction.shop:8081/api/v1/user/info', // 사용자 정보 API 엔드포인트
            {
              withCredentials: true,
            }
        );
          const { userID, username, displayName, tier, userURL } = userInfoResponse.data;
          console.log('User Info:', { userID, username, displayName, tier, userURL });
          
      //     // 필요한 로직 처리 후 홈 페이지로 리다이렉트
      //     router.push('/');  // '/'는 home 페이지를 의미
  
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };
  
  const handleGoogleLogin = () => {
    router.push ("https://master-of-prediction.shop:8081/oauth2/authorization/google");
  };


  return (
    <main className=" w-full border-x border-slate-200">
     
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
            <Button variant="light" size="lg" className="p-2 font-bold">예측의 달인 </Button>
            </Link>
            <form className="mt-6" onSubmit={handleSubmit} >
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
                <Link href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">
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

            <Button
              type="button"
              className="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300"
              onClick={handleGoogleLogin}
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 48 48">
                  <defs>
                    <path
                      id="a"
                      d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                    />
                  </defs>
                  <clipPath id="b">
                    <use xlinkHref="#a" overflow="visible" />
                  </clipPath>
                  <path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
                  <path clipPath="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
                  <path clipPath="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
                  <path clipPath="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
                </svg>
                <span className="ml-4">Log in with Google</span>
              </div>
            </Button>

            <p className="mt-8">
              Need an account?
              <Link href="/signin" className="text-blue-500 hover:text-blue-700 font-semibold">
                Create an account
              </Link>
            </p>

            <p className="text-sm text-gray-500 mt-12">&copy; 2024 예측의 달인 - All Rights Reserved.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
