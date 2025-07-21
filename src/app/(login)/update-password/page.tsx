import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UpdatePasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col w-50 justify-center items-center">
        In Progress...
        <Button>
          <Link href="/login">Back to Login Page</Link>
        </Button>
      </div>
    </div>
  );
}
