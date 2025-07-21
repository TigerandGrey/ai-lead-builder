import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Terms() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col w-50 justify-center items-center">
        some terms...
        <Button>
          <Link href="/sign-up">Back to SignUp Page</Link>
        </Button>
      </div>
    </div>
  );
}
