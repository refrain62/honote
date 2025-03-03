import { prisma } from "@/lib/prisma";
import { deleteBlogByIdRoute } from "../routes/blogRoutes";
import { RouteHandler } from "@hono/zod-openapi";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export const deleteBlogByIdHandler: RouteHandler<typeof deleteBlogByIdRoute> = async (c) => {
  const { id } = c.req.param();

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

  await prisma.blog.delete({
    where: { id: Number(id) }
  });

  revalidatePath("/")

  return c.json({ id, message: "ブログを削除しました" }, 200)
}
