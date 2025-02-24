import { prisma } from "@/lib/prisma";
import { getBlogByIdRoute } from "../routes/blogRoutes";
import { RouteHandler } from "@hono/zod-openapi";

export const getBlogByIdHandler: RouteHandler<typeof getBlogByIdRoute> = async (c) => {
  const { id } = c.req.param();
  const blog = await prisma.blog.findUnique({
    where: { id: Number(id) },
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      }
    }
  })

  if (!blog) {
    return c.json(null, 404)
  }

  return c.json(blog, 200)
}