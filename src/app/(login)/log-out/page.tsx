import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LogOutPage() {
  return (
    <div className="flex flex-col w-50 justify-center items-center">
      In Progress...
      <Button>
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
