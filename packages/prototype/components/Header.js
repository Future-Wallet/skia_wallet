import { ChevronDownIcon, SearchIcon } from '@heroicons/react/outline';
import React from 'react';
import Link from 'next/link';
import {
  BellIcon,
  CurrencyDollarIcon,
  PlusCircleIcon,
} from '@heroicons/react/solid';
import Image from 'next/image';

function Header({ walleetOfUser }) {
  return (
    <div className="flex w-full items-center sticky top-0 justify-between h-14 shadow-md bg-[#1b212c] z-50">
      <div className="absolute w-[13rem] h-14 p-2 pl-8" />
      <div className="h-14 mr-8 hidden sm:flex">
        <Image
          src="/SkiaWalletLogo.png"
          alt="Skia Wallet Logo"
          layout="fixed"
          height={55}
          width={180}
          className="cursor-pointer"
        />
      </div>
      <div className="flex items-center bg-gray-100 rounded-full shadow-2xl w-56 h-7 m-4 ml-6">
        <SearchIcon className="h-7 p-1 ml-2" />
        <input
          type="text"
          placeholder="Search items, collections,..."
          className="h-6 w-40 bg-transparent ml-2 text-xs border-0"
        />
      </div>

      <div className="flex grow items-center gap-2 justify-end">
        <Link href="/" passHref>
          <div className="h-8 scaleButton w-32 bg-blue-500 rounded-full flex items-center p-2 justify-around cursor-pointer">
            <CurrencyDollarIcon className="text-white h-5 scaleButton" />
            <p className="text-xs text-white font-semibold">$20,234.00</p>
            <PlusCircleIcon className="text-white h-5 scaleButton" />
          </div>
        </Link>
        <Link href="/" passHref>
          <div className="headerIconCircle cursor-pointer scaleButton">
            <BellIcon className="iconSize" />
          </div>
        </Link>
        <Link href="/" passHref>
          <div className="flex items-center rounded-full bg-gray-300 h-10 mr-8 cursor-pointer shadow-lg ">
            <Image
              src="/SkiaWalletSymbol.png"
              alt="Skia Wallet symbol"
              layout="fixed"
              height={42}
              width={42}
              className="rounded-full  "
            />
            <div className="scale-90 ml-1 sm:w-24 ">
              <p className="text-sm font-semibold hidden sm:flex">
                {walleetOfUser}
              </p>
              <p className="text-xs ml-0.5 hidden sm:flex scaleText">
                @username
              </p>
            </div>
            <ChevronDownIcon className="h-5 pr-4 scaleText" />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Header;
