import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

const Header = () => {
  return (
    <nav className='p-4 flex justify-between items-center'>
      <Link href="/"><Image src="/talynq/talynq-text.png" alt="Logo" width={100} height={100} /></Link>

      <Button variant={"outline"} className='cursor-pointer'>Login</Button>
    </nav>
  )
}

export default Header