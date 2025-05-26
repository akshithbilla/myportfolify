import { Button } from "@heroui/button";
//import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
//import { Input } from "@heroui/input";
import {  subtitle } from "@/components/primitives";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { useNavigate } from 'react-router-dom';
//import { link as linkStyles } from "@heroui/theme";
//import clsx from "clsx";
import myportfolify from "./myportfolify.jpg";// logo

//import { siteConfig } from "@/config/site";
//import { ThemeSwitch } from "@/components/theme-switch";
//import { GithubIcon } from "@/components/icons";

interface MainNavbarProps {
  user: any; // You can replace 'any' with a proper User type/interface
  setUser: (user: any) => void;
}

export const MainNavbar = ({ user, setUser }: MainNavbarProps) => {
  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token"); // Remove JWT from storage
  setUser(null);                    // Clear user state
  navigate('/');                    // Redirect to homepage (or "/login" if you prefer)
};

  
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      {/* Left - Brand & Nav Links */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <div className="flex items-center space-x-2">
   <div className={subtitle({ class: "mt-4 flex items-center gap-2" })}>
  <img
    src={myportfolify}
    alt="myportfolify Logo"
    style={{ width: "24px", height: "24px", borderRadius: "50%" }}
  />
  myportfolify
</div>

</div>

          </Link>
        </NavbarBrand>
        <NavbarItem>
    <span className="text-sm font-medium text-default-600">  {user.user}</span>
  </NavbarItem>
        
      </NavbarContent>

      {/* Right - Search, Theme, Account */}
      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
       
       

        <NavbarItem className="hidden md:flex">
          <Button
            className="text-sm font-normal text-default-600 bg-default-100"
            onClick={handleLogout}
            startContent={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            }
            variant="flat"
          >
            Logout
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Icons */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
         
        
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
  
  <div className="mx-4 mt-2 flex flex-col gap-2">
    

    {/* 👇 Mobile Logout Option */}
    <NavbarMenuItem>
      <Button
        onClick={handleLogout}
        variant="flat"
        className="w-full justify-start text-danger"
        startContent={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        }
      >
        Logout
      </Button>
    </NavbarMenuItem>
  </div>
</NavbarMenu>

    </HeroUINavbar>
  );
};
