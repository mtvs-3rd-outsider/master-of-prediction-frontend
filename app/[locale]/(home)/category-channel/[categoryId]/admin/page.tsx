'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Toast } from "@/components/ui/toast"
import { useToast } from '@ui/use-toast'

type Manager = {
  id: number;
  name: string;
  role: 'manager' | 'sub-manager';
}

export default function GalleryManagement() {
  const [managers, setManagers] = useState<Manager[]>([
    { id: 1, name: '매니저1', role: 'manager' },
  ])
  const [newManagerName, setNewManagerName] = useState('')
  const { toast } = useToast()

  const addSubManager = () => {
    if (newManagerName.trim() === '') {
      toast({
        title: "오류",
        description: "부매니저 이름을 입력해주세요.",
        variant: "destructive",
      })
      return
    }
    const newManager: Manager = {
      id: managers.length + 1,
      name: newManagerName,
      role: 'sub-manager'
    }
    setManagers([...managers, newManager])
    setNewManagerName('')
    toast({
      title: "성공",
      description: `${newManagerName}님이 부매니저로 임명되었습니다.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">갤러리 관리 권한</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>매니저 권한</CardTitle>
            <CardDescription>마이너 갤러리의 개설자</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>게시물 관리 권한</li>
              <li>부매니저 임명 권한</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>부매니저 권한</CardTitle>
            <CardDescription>매니저가 임명한 보조 관리자</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>매니저를 보조하여 갤러리 관리</li>
              <li>제한된 게시물 관리 권한</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>관리자 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>역할</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managers.map((manager) => (
                  <TableRow key={manager.id}>
                    <TableCell>{manager.name}</TableCell>
                    <TableCell>{manager.role === 'manager' ? '매니저' : '부매니저'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>부매니저 임명</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">이름</Label>
                <Input 
                  id="name" 
                  placeholder="새 부매니저 이름" 
                  value={newManagerName}
                  onChange={(e) => setNewManagerName(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={addSubManager}>부매니저 임명</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

