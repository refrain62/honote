"use client"

import { hono } from "@/lib/hono";
import { Blog } from "@/server/models/blogSchemas";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditForm({ blog }: { blog: Blog }) {

  const { id, title: currentTitle, content: currentContent } = blog

  const [title, setTitle] = useState(currentTitle);
  const [content, setContent] = useState(currentContent);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await hono.api.blogs[":id"].$put({
        param: {
          id: String(id)
        },
        json: {
          title,
          content,
        },
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to submit blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">ブログを更新する</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium">タイトル</label>
            <input
              type="text"
              className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ブログタイトルを書いてね"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">内容</label>
            <textarea
              className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
              placeholder="ブログの内容を書いてね"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Update Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}
