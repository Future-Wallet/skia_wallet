import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  TemplateIcon,
  IdentificationIcon,
  BookmarkAltIcon,
  ClipboardCheckIcon,
  ClipboardListIcon,
  LogoutIcon,
} from '@heroicons/react/outline'
import {
  ViewGridIcon,
  MailIcon,
  ShoppingCartIcon,
  LightningBoltIcon,
  ShoppingBagIcon,
  HomeIcon,
} from '@heroicons/react/solid'

function Sider({ generateMyMnemonic }) {
  return (
    <div className="siderOpacity sticky top-14 h-[45rem] shadow-md">
      <div className="absolute h-full bg-white"></div>
      <div className="relative z-20 ml-2 grid">
        <div className="">
          <h1 className="headerTitle">Menu</h1>
          <Link href="/">
            <div className="headerLinkWrapper">
              <div className="headerIconCircle">
                <ViewGridIcon className="iconSize" />
              </div>
              <button className="headerLinkText">
                Dashboard
              </button>
            </div>
          </Link>
          <Link href="/">
            <div className="headerLinkWrapper">
              <div className="headerIconCircle ">
                <LightningBoltIcon className="iconSize" />
              </div>
              <button onClick={generateMyMnemonic} className="headerLinkText">
                Create Wallet
              </button>
            </div>
          </Link>
          <Link href="/">
            <div className="headerLinkWrapper">
              <div className="headerIconCircle ">
                <ShoppingBagIcon className="iconSize" />
              </div>
              <h2 className="headerLinkText ">Import Wallet</h2>
            </div>
          </Link>
          <Link href="/">
            <div className="headerLinkWrapper">
              <div className="headerIconCircle ">
                <HomeIcon className="iconSize" />
              </div>
              <h2 className="headerLinkText ">My Wallet</h2>
            </div>
          </Link>
          <Link href="/">
            <div className="headerLinkWrapper">
              <div className="headerIconCircle ">
                <ShoppingCartIcon className="iconSize" />
              </div>
              <h2 className="headerLinkText ">Send</h2>
            </div>
          </Link>
          <Link href="/">
            <div className="headerLinkWrapper">
              <div className="headerIconCircle ">
                <BookmarkAltIcon className="iconSize" />
              </div>
              <h2 className="headerLinkText ">NFTs</h2>
            </div>
          </Link>
          <Link href="/">
            <div className="headerLinkWrapper">
              <div className="headerIconCircle ">
                <ClipboardListIcon className="iconSize" />
              </div>
              <h2 className="headerLinkText ">History</h2>
            </div>
          </Link>
          <Link href="/">
            <div className="headerLinkWrapper">
              <div className="headerIconCircle ">
                <MailIcon className="iconSize" />
              </div>
              <h2 className="headerLinkText ">Messages</h2>
            </div>
          </Link>
          <h1 className="headerTitle">User Settings</h1>

          <Link href="/">
            <div className="headerLinkWrapper">
              <div className="headerIconCircle ">
                <IdentificationIcon className="iconSize" />
              </div>
              <h2 className="headerLinkText ">Profile</h2>
            </div>
          </Link>
          <Link href="/">
            <div className="headerLinkWrapper">
              <div className="headerIconCircle ">
                <TemplateIcon className="iconSize" />
              </div>
              <h2 className="headerLinkText ">Settings</h2>
            </div>
          </Link>
          <Link href="/">
            <button className="m-3 flex h-12 w-32 items-center justify-center gap-2 rounded-full bg-blue-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <LogoutIcon className="h-6" />
              </div>
              <h2 className="mr-2 font-bold text-white ">Signout</h2>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sider
