import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  userRole?: "Technician" | "Administrator" | "BackOffice";
  userName?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

const Header = ({
  userRole = "Technician",
  userName = "John Doe",
  userAvatar = "",
  onLogout = () => console.log("Logout clicked"),
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <img src="/vite.svg" alt="Company Logo" className="h-8 w-8 mr-2" />
            <h1 className="text-xl font-bold">Maintenance Pro</h1>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              userRole === "Administrator"
                ? "bg-blue-100 text-blue-800"
                : userRole === "BackOffice"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-green-100 text-green-800",
            )}
          >
            {userRole}
          </span>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{userRole}</p>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={onLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4 border-b">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback>
                        {userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {userRole}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex-1 py-4">
                  <nav className="flex flex-col gap-4">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium self-start",
                        userRole === "Administrator"
                          ? "bg-blue-100 text-blue-800"
                          : userRole === "BackOffice"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800",
                      )}
                    >
                      {userRole}
                    </span>
                  </nav>
                </div>
                <div className="py-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onLogout}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
