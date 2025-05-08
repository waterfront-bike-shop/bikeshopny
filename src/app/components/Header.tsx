"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { List } from "phosphor-react";

const navLinks = [
  { name: "Rentals", href: "/rentals" },
  { name: "About", href: "/about" },
  { name: "Parts & Accessories", href: "/shop" },
  { name: "Repairs", href: "/repairs" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full px-4 py-3 border-b shadow-sm bg-white flex items-center justify-between">
      {/* Left: Logo and Shop Name */}
      <Link href="/" className="flex items-center space-x-3">
        {/* NOTE: GET HIGHER-RES LOGO!!! */}
        <Image
          src="/images/waterfront-bicycle-shop-logo.webp"
          alt="Waterfront Bicycle Shop Logo"
          width={141}
          height={77}
          className="hidden sm:block md:mr-10"
        />
        <span className="text-xl md:text-3xl xl:text-4xl font-bold ">
          <span className="text-sky-500">WATERFRONT</span> Bicycle Shop
        </span>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-gray-700 hover:text-gray-900"
          >
            {link.name}
          </Link>
        ))}
        <Link href="/rentals" passHref>
          <Button className="bg-red-500 text-white hover:bg-red-600">
            Rent a Bike
          </Button>
        </Link>
      </nav>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <List size={28} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg text-gray-800 hover:text-gray-900 pl-4"
                >
                  {link.name}
                </Link>
              ))}
              <Link className="pl-2" href="/rentals" passHref>
                <Button
                  className="mt-4 bg-red-500 text-white hover:bg-red-600"
                  onClick={() => setOpen(false)}
                >
                  Rent a Bike
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
