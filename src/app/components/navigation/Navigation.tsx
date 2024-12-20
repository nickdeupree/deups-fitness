"use client";

import React, { useState, useEffect } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenu, NavbarMenuToggle, Avatar } from "@nextui-org/react";
import useIsMobile from '../../hooks/useIsMobile';
import { CgGym } from "react-icons/cg";
import { FaUserCircle } from "react-icons/fa";
import { auth } from '../../lib/firebaseClient';
import { useTheme } from 'next-themes';


function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log("OnAuthChange: ", user);
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setUser(auth.currentUser);
    }
  }, [isLoggedIn]);  

  return (
    <Navbar isBordered className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
      <NavbarBrand>
        <Link href="/" className="flex items-center space-x-2 mr-2 text-lg">
          <CgGym className="text-2xl" />
          <p className="font-bold">Deup&apos;s Fitness</p>
        </Link>
      </NavbarBrand>
      {isMobile ? (
        <div>
          <NavbarMenuToggle aria-label="Toggle navigation menu" />
          <NavbarMenu>
            <NavbarItem>
              <Link href="/nutrition" className={theme === 'dark' ? 'text-white' : 'text-black'}>
                Nutrition
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/workouts" className={theme === 'dark' ? 'text-white' : 'text-black'}>
                Workouts
              </Link>
            </NavbarItem>
            <NavbarItem>
            <Link href="/about" className={theme === 'dark' ? 'text-white' : 'text-black'}>
              About
            </Link>
          </NavbarItem>
            <Link href="/profile" className={theme === 'dark' ? 'text-white' : 'text-black'}>
              Profile
            </Link>
          </NavbarMenu>
        </div>
      ) : (
        <NavbarContent>
          <NavbarItem>
            <Link href="/nutrition" className={theme === 'dark' ? 'text-white' : 'text-black'}>
              Nutrition
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/workouts" className={theme === 'dark' ? 'text-white' : 'text-black'}>
              Workouts
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/about" className={theme === 'dark' ? 'text-white' : 'text-black'}>
              About
            </Link>
          </NavbarItem>
          {isLoggedIn ? (
            <NavbarItem>
              <Link href="/profile">
              <Avatar
                src={user?.photoURL || ''}
                alt="User Avatar"
                className="text-white"
              />
              </Link>
            </NavbarItem>
          ) : (
            <NavbarItem>
              <Button variant="flat" as={Link} href="/login" className={theme === 'dark' ? 'text-white' : 'text-black'}>
                Login
              </Button>
            </NavbarItem>
          )}
        </NavbarContent>
      )}
    </Navbar>
  );
}

export default Navigation;