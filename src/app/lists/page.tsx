"use client";

import { useSession } from "next-auth/react";
import Container from "@/components/Container";
import UserListsSection from "@/components/Lists/UserListsSection";

export default function ListsOverviewPage() {
  const { data:session } = useSession();


  return (
    <Container>
      <div className="py-10 ">
        <UserListsSection listPage={true} userId={session?.user?.id} />
      </div>
    </Container>
  );
}