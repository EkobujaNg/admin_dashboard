import { redirect } from "next/navigation";

export default function VerifyCodePage() {
  redirect("/forgot-password");
}
