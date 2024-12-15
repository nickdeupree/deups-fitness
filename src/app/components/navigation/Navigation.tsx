"use client";

import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenu, NavbarMenuToggle } from "@nextui-org/react";
import useIsMobile from '../../hooks/useIsMobile';
import { CgGym } from "react-icons/cg";

function Navigation() {
  const isMobile = useIsMobile();

  return (
    <Navbar isBordered>
      <NavbarBrand>
        <Link color="foreground" href="/" className="flex items-center space-x-2 mr-2 text-lg">
          <CgGym className="text-2xl" />
          <p className="font-bold text-inherit">Deup's Fitness</p>
        </Link> 
      </NavbarBrand>
      {isMobile ? (
        <>
          {/* NavbarMenuToggle for mobile view */}
          <NavbarMenuToggle aria-label="Toggle navigation menu" />
          {/* NavbarMenu for mobile view */}
          <NavbarMenu>
            <NavbarItem>
              <Link color="foreground" href="/nutrition">
                Nutrition
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="/workouts">
                Workouts
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/signup" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </NavbarMenu>
        </>
      ) : (
        <>
          {/* NavbarContent for desktop view */}
          <NavbarContent className="gap-4" justify="center">
            <NavbarItem>
              <Link color="foreground" href="/nutrition">
                Nutrition
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="/workouts">
                Workouts
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <Link href="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/signup" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </NavbarContent>
        </>
      )}
    </Navbar>
  );
}

export default Navigation;