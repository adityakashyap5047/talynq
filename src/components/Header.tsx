"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SignedIn, SignedOut, SignIn, SignUp, UserButton, useUser } from '@clerk/nextjs';
import { BriefcaseBusiness, Heart, PenBox } from 'lucide-react';
import { Button } from './ui/button';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const { user, isSignedIn, isLoaded } = useUser();

  const router = useRouter();
  const searchParams = useSearchParams();

  const signInParam = searchParams.get('sign-in');
  const signUpParam = searchParams.get('sign-up');

  useEffect(() => {
    if (signInParam === 'true') {
      setShowSignUp(false);
      setTimeout(() => setShowSignIn(true), 0);
    } else {
      setShowSignIn(false);
    }

    if (signUpParam === 'true') {
      setShowSignIn(false);
      setTimeout(() => setShowSignUp(true), 0);
    } else {
      setShowSignUp(false);
    }
  }, [signInParam, signUpParam]);

  useEffect(()=> {
    if (!isSignedIn) return;
    const addUser = async () => {
      await axios.post('/api/add-user');
    }
    addUser();
  }, [isSignedIn])

  useEffect(() => {
    const isModalOpen = showSignIn || showSignUp;

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showSignIn, showSignUp]);


  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setShowSignUp(false);

      const params = new URLSearchParams(searchParams.toString());
      params.delete('sign-in');
      params.delete('sign-up');

      const newUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ''}`;
      router.replace(newUrl);
    }
  };

  const openSignIn = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sign-in', 'true');
    router.replace(`?${params.toString()}`);
    setShowSignIn(true);
  };

  return (
    <>
      <nav className='p-4 flex justify-between items-center'>
        <Link href="/">
          <Image src="/talynq/talynq-text.png" className='h-10' alt="Logo" width={100} height={100} />
        </Link>

        {!isLoaded ? <BeatLoader color="#36d7b7" /> : (
          <div className="flex gap-4 justify-center items-center">
            <SignedOut>
              <Button variant="outline" onClick={openSignIn}>Login</Button>
            </SignedOut>

            <SignedIn>
              {user?.unsafeMetadata.role === 'recruiter' && <Link href="/post-job">
                <Button variant="destructive" className="rounded-full">
                  <PenBox size={20} className="mr-1" />
                  Post Job
                </Button>
              </Link>}
              <UserButton appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                }
              }}>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label='My Jobs'
                    labelIcon={<BriefcaseBusiness size={15} />}
                    href="/my-jobs"
                  />
                  <UserButton.Link
                    label='Saved Jobs'
                    labelIcon={<Heart size={15} />}
                    href="/saved-jobs"
                  />
                  <UserButton.Action label='manageAccount' />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          </div>
        )}
      </nav>
      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center z-20 justify-center bg-black/50"
          onClick={handleOverlayClick}
        >
          <SignIn
            routing="hash"
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}

      {showSignUp && (
        <div
          className="fixed inset-0 flex z-20 items-center justify-center bg-black/50"
          onClick={handleOverlayClick}
        >
          <SignUp
            routing="hash"
            signInForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default Header;