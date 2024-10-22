// pages/signin.js
"use client";
import Head from 'next/head';
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import Link from 'next/link';
import Image from 'next/image';
import apiClient from '@handler/fetch/axios';  
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [authNum, setAuthNum] = useState('');
  const [timer, setTimer] = useState('03:00');
  const [intervalId, setIntervalId] = useState<any>(null);

  const handleGoogleLogin = () => {
    router.push ("https://master-of-prediction.shop:8081/oauth2/authorization/google");
  };

  const startTimer = (duration:any) => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    let timer = duration;
    const id = setInterval(() => {
      const minutes = Math.floor(timer / 60);
      const seconds = timer % 60;
      setTimer(`${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);

      if (--timer < 0) {
        clearInterval(id);
        setTimer('03:00');
      }
    }, 1000);
    setIntervalId(id);
  };

  const handleEmailSend = async () => {
      const response = await apiClient.post('/auth/signup/email', { email });
      if (response.data.code === 200) {
        startTimer(60 * 3); // 3분 타이머 시작
      }
   
  };

  const handleCodeVerification = async () => {
      const response = await apiClient.post('/auth/signup/emailAuth', { email: email, authNum: authNum });
  
      if (response.status === 200) {
        clearInterval(intervalId);
        setTimer('03:00');
        toast.success("인증에 성공했습니다.")
      }   else{
        toast.error("인증에 실패했습니다.")

      }
  };
  

  const handleSubmit = async (event:any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      userName: formData.get('userName'),
      email: formData.get('email'),
      password: formData.get('password'),
    };
    try {
      const response = await apiClient.post('/auth/register', data);
      router.push('/login');
    } catch (error) {
      console.error(error);
      toast.error('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <main className="w-full border-x border-slate-200">
      <section className="flex flex-col md:flex-row h-screen items-center w-full">
        <div className="bg-blue-600 hidden lg:block lg:w-1/2 xl:w-2/3 h-full relative">
          <Image
            src="/images/login-bg.webp"
            alt="Background Image"
            className="w-full h-full object-cover"
            layout="fill"
          />
        </div>

        <div className="bg-white w-full md:w-1/2 xl:w-1/3 h-full flex items-center justify-center px-6 lg:px-16 xl:px-12">
          <div className="w-full max-w-md">
            <Link href={"/"}>
              <Button variant="light" size="lg" className="p-2 font-bold">예측의 달인</Button>
            </Link>
            <form className="mt-6" onSubmit={handleSubmit}>
              <Input
                name="userName"
                isRequired
                type="text"
                label="Full Name"
                autoFocus
                variant="bordered"
                required
              />

              <div className="inline-flex w-full mt-4">
                <Input
                  name="email"
                  isRequired
                  type="email"
                  label="Email"
                  autoComplete="on"
                  required
                  className="w-2/3"
                  variant="bordered"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  type="button"
                  className="w-1/3 ml-3 bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3"
                  onClick={handleEmailSend}
                >
                  발송
                </Button>
              </div>
              <div className="mt-2 mx-2 text-end text-gray-600">
                {timer !== '03:00' && <p>남은시간 {timer}</p>}
              </div>
              <div className="inline-flex w-full mt-4">
                
                <Input
                  type="number"
                  label="Code"
                  autoComplete="on"
                  variant="bordered"
                  className="w-2/3"
                  onChange={(e) => setAuthNum(e.target.value)}
                />
                 {/* 타이머를 화면에 표시 */}
           
                <Button
                  type="button"
                  className="w-1/3 ml-3 hover:bg-gray-400 text-black font-semibold rounded-lg px-4 py-3"
                  onClick={handleCodeVerification}
                >
                  인증확인
                </Button>
              
              </div>
   
              <div className="mt-4">
                <Input
                  name="password"
                  isRequired
                  label="Password"
                  type="password"
                  variant="bordered"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
              >
                Sign Up
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
                <span className="ml-4">Sign up with Google</span>
              </div>
            </Button>

            <p className="mt-8">
              Already have an account? 
              <Link href="/login" className="text-blue-500 hover:text-blue-700 font-semibold">
                Log in
              </Link>
            </p>

            <p className="text-sm text-gray-500 mt-12">&copy; 2024 예측의 달인 - All Rights Reserved.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
