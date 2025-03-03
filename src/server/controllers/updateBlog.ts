import { prisma } from "@/lib/prisma";
import { updateBlogByIdRoute } from "../routes/blogRoutes";
import { RouteHandler } from "@hono/zod-openapi";
import { revalidateTag } from "next/cache";
import { auth } from "@/auth";

export const updateBlogByIdHandler: RouteHandler<typeof updateBlogByIdRoute> = async (c) => {
  const { id } = c.req.param();
  const data = await c.req.json();

  const session = await auth();
  console.log(session)

  // 認証をチェック
  if (!session?.user?.id) {
    throw Error("認証してください。")
  }

  const blog = await prisma.blog.findUnique({
    where: { id: Number(id) },
  });

  // ブログが見つからない場合
  if (!blog) {
    return c.json(null, 404)
  }

  // ユーザーがブログの所有者でない場合
  if (session?.user?.id !== blog.userId) {
    throw Error("ブログの所有者ではありません。")
  }

  const updateBlog = await prisma.blog.update({
    where: { id: Number(id) },
    data,
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      }
    }
  });

  revalidateTag("update")

  return c.json(updateBlog, 200)
}
