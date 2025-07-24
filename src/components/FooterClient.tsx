"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Footer = dynamic(() => import("./Footer"), { ssr: false });

const FooterClient = () => {
  return (
    <Suspense fallback={null}>
      <Footer />
    </Suspense>
  );
}

export default FooterClient