import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import CompanyCarousel from '@/components/CompanyCarousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import faqs from "@/data/faqs.json";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className='bg-slate-900'>
          <CardHeader>
            <CardTitle className="font-bold">For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            Search and apply for jobs, track applications, and more.
          </CardContent>
        </Card>
        <Card className='bg-slate-900'>
          <CardHeader>
            <CardTitle className="font-bold">For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            Post jobs, manage applications, and find the best candidates.
          </CardContent>
        </Card>
      </section>
      {/* FAQ Section */}
      <section id="faqs" className="bg-gray-950 py-20 px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h3>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className={"cursor-pointer"}>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  )
}

export default Page