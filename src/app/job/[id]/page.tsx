import React from 'react'

interface JobPageProps {
    params: { id: string };
}

const JobPage = async ({ params }: JobPageProps) => {

    const { id } = await params;

  return (
    <div>JobPage - {id}</div>
  )
}

export default JobPage