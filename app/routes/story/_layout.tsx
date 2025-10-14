import { Link, Outlet } from "react-router";
import { Button } from "~/components/ui/button";
import { story } from "./data";

export default function Page() {
  return (
    <div className="min-h-dvh h-dvh flex flex-col bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 ">
      <header className="pt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src="/img/banner1t.png" alt="Terimu te Taniwha" className="h-16" />
            </div>
            
            <nav className="flex items-center space-x-4">
              {/* <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Mini Games:</span>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/game1">Game 1</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/game2">Game 2</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/game3">Game 3</Link>
                </Button>
              </div> */}
              
              <div className="h-6 w-px bg-gray-300" />
              
              {/* <Button variant="default" size="sm" asChild>
                <Link to="/">Home</Link>
              </Button> */}
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
