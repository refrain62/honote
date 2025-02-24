import { auth } from "@/auth";
import NewForm from "@/components/new-form"

export default async function Page() {

  const session = await auth()

  if (!session) {
    return <div>ログインしてください。</div>
  }

  return (
    <div>
      <NewForm />
    </div>
  );
}
