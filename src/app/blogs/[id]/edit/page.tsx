import EditForm from "@/components/edit-form";
import { hono } from "@/lib/hono";
import { fetcher } from "@/lib/hono/utils";
import { InferResponseType } from "hono";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {

  const { id } = params

  const url = hono.api.blogs[":id"].$url({ param: { id: String(id) } })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const $get = hono.api.blogs[":id"].$get
  type ResType = InferResponseType<typeof $get>;

  const blog = await fetcher<ResType>(url, {
    cache: "no-store",
    next: {
      tags: ["tag"]
    }
  })

  if (!blog) notFound();

  return (
    <EditForm blog={blog} />
  );
}
