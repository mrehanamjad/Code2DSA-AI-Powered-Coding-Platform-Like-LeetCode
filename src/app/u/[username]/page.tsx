import React from 'react'
import { Suspense } from "react";
import ProfilePg from './ProfilePg';
import ProfileSkeleton from '@/components/Skeletons/ProfileSkeleton';
import Container from '@/components/Container';

async function ProfilePag({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><ProfileSkeleton /></div>}>
      <Container>
        <ProfilePg username={username} />
      </Container>
    </Suspense> 
  )
}

export default ProfilePag