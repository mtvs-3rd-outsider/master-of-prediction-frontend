"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@ui/use-toast";

type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
};

type Comment = {
  id: number;
  postId: number;
  content: string;
  author: string;
};

type BlockedItem = {
  id: number;
  type: "word" | "id" | "ip" | "nickname";
  value: string;
};

export default function GalleryManagementFeatures() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "첫 번째 게시물",
      content: "안녕하세요!",
      author: "작성자1",
    },
    {
      id: 2,
      title: "두 번째 게시물",
      content: "반갑습니다!",
      author: "작성자2",
    },
  ]);
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, postId: 1, content: "환영합니다!", author: "댓글작성자1" },
    { id: 2, postId: 2, content: "좋은 글이네요.", author: "댓글작성자2" },
  ]);
  const [blockedItems, setBlockedItems] = useState<BlockedItem[]>([
    { id: 1, type: "word", value: "비속어" },
    { id: 2, type: "id", value: "baduser" },
  ]);
const [newBlockItem, setNewBlockItem] = useState<{
  type: "word" | "id" | "ip" | "nickname";
  value: string;
}>({
  type: "word", // 초기값
  value: "",
});


  const { toast } = useToast();

  const deletePost = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id));
    setComments(comments.filter((comment) => comment.postId !== id));
    toast({
      title: "게시물 삭제",
      description: `게시물 ID ${id}가 삭제되었습니다.`,
    });
  };

  const deleteComment = (id: number) => {
    setComments(comments.filter((comment) => comment.id !== id));
    toast({
      title: "댓글 삭제",
      description: `댓글 ID ${id}가 삭제되었습니다.`,
    });
  };

  const addBlockedItem = () => {
    if (newBlockItem.value.trim() === "") {
      toast({
        title: "오류",
        description: "차단할 항목을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    const newItem: BlockedItem = {
      id: blockedItems.length + 1,
      ...newBlockItem,
    };
    setBlockedItems([...blockedItems, newItem]);
    setNewBlockItem({ ...newBlockItem, value: "" });
    toast({
      title: "차단 항목 추가",
      description: `${newBlockItem.type}: ${newBlockItem.value}가 차단되었습니다.`,
    });
  };

  const removeBlockedItem = (id: number) => {
    setBlockedItems(blockedItems.filter((item) => item.id !== id));
    toast({
      title: "차단 항목 제거",
      description: `차단 항목 ID ${id}가 제거되었습니다.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">갤러리 관리 기능</h1>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">게시물 및 댓글 관리</TabsTrigger>
          <TabsTrigger value="block">차단 설정</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>게시물 관리</CardTitle>
              <CardDescription>
                부적절한 게시물을 삭제할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>제목</TableHead>
                    <TableHead>작성자</TableHead>
                    <TableHead>액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>{post.id}</TableCell>
                      <TableCell>{post.title}</TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          onClick={() => deletePost(post.id)}
                        >
                          삭제
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>댓글 관리</CardTitle>
              <CardDescription>
                부적절한 댓글을 삭제할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>내용</TableHead>
                    <TableHead>작성자</TableHead>
                    <TableHead>액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell>{comment.id}</TableCell>
                      <TableCell>{comment.content}</TableCell>
                      <TableCell>{comment.author}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          onClick={() => deleteComment(comment.id)}
                        >
                          삭제
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="block">
          <Card>
            <CardHeader>
              <CardTitle>차단 설정</CardTitle>
              <CardDescription>
                특정 단어, ID, IP, 닉네임 등을 차단하여 갤러리 환경을
                유지합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="blockType">차단 유형</Label>
                  <select
                    id="blockType"
                    value={newBlockItem.type}
                    onChange={(e) =>
                      setNewBlockItem({
                        ...newBlockItem,
                        type: e.target.value as
                          | "word"
                          | "id"
                          | "ip"
                          | "nickname",
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="word">단어</option>
                    <option value="id">ID</option>
                    <option value="ip">IP</option>
                    <option value="nickname">닉네임</option>
                  </select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="blockValue">차단할 값</Label>
                  <Input
                    id="blockValue"
                    value={newBlockItem.value}
                    onChange={(e) =>
                      setNewBlockItem({
                        ...newBlockItem,
                        value: e.target.value,
                      })
                    }
                    placeholder="차단할 항목을 입력하세요"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={addBlockedItem}>차단 항목 추가</Button>
            </CardFooter>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>차단된 항목 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>유형</TableHead>
                    <TableHead>값</TableHead>
                    <TableHead>액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blockedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.value}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          onClick={() => removeBlockedItem(item.id)}
                        >
                          제거
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
