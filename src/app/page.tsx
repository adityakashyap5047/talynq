import Image from 'next/image'
import React from 'react'

const Page = () => {
  return (
    <div>
      <section>
        <h1>Find your dream job <span className='flex'>and get <Image src={"/talynq/placed.png"} className='h-10 w-auto' height={100} width={100} alt='Placed logo'/></span></h1>
      </section>
    </div>
  )
}

export default Page