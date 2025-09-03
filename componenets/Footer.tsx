import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2">
          <Image src="/images/f.png" alt="visa" width={225} height={65} />
          {/* <Image src="/images/paypal.png" alt="visa" width={65} height={65} />
          <Image src="/images/card.png" alt="master" width={89} height={4} /> */}
        </div>
        <p className="text-[14px] py-4">2022 Evershop. All Rights Reserved.</p>
      </div>
      <div className="h-[30px]"></div>
    </div>
  );
};

export default Footer;
