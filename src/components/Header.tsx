"use client";

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/nextjs'
import { PenBox } from 'lucide-react'

const Header = () => {

  const [showSignIn, setShowSignIn] = React.useState(false);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
    }
  };

  return (
    <>
      <nav className='p-4 flex justify-between items-center'>
        <Link href="/"><Image src="/talynq/talynq-text.png" alt="Logo" width={100} height={100} /></Link>

        <div className="flex gap-8">
          <SignedOut>
            <Button variant={"outline"} onClick={() => setShowSignIn(true)}>Login</Button>
          </SignedOut>
          <SignedIn>
            {/* Add a condition here  */}
            <Link href="/post-job">
              <Button variant={"destructive"} className='rounded-full'>
                <PenBox size={20} className='mr-1' />
                Post Job
              </Button>
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
      {showSignIn && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50'
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl={"/onboarding"}
            fallbackRedirectUrl={"/"}
          />
        </div>
      )}
    </>
  )
}

export default Header