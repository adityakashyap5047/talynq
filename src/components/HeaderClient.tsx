"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Header = dynamic(() => import("./Header"), { ssr: false });

const HeaderClient = () => {
  return (
    <Suspense fallback={null}>
      <Header />
    </Suspense>
  );
}

export default HeaderClient