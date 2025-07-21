import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import CompanyCarousel from '@/components/CompanyCarousel';

const Page = () => {
  return (
    <div className='flex flex-col gap-10 sm:gap-20 py-10 sm:py-20 px-4 sm:px-0'>
      <section className='text-center'>
        <h1 className="flex flex-col items-center justify-center leading-tight text-4xl sm:text-6xl lg:text-8xl font-extrabold gradient-title">
          Find your dream job
          <span className="flex items-center gap-3 sm:gap-6">
            and get
            <Image
              src="/talynq/placed.png"
              alt="Placed logo"
              height={64}
              width={150}
              className="h-[1em] w-auto align-middle"
            />
          </span>
        </h1>
        <p className='text-gray-300 sm:mt-4 text-xs sm:text-xl'>
          Explore thousands of job listings or find the perfect candidate.
        </p>
      </section>
      <div className='flex gap-6 justify-center'>
        <Link href="/jobs">
          <Button variant={"blue"} size={"xl"}>Find Jobs</Button>
        </Link>
        <Link href="/post-job">
          <Button variant={"destructive"} size={"xl"}>Post Job</Button>
        </Link>
      </div>
      <CompanyCarousel />
    </div>
  )
}

export default Page