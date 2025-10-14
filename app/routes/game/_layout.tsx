import { Outlet } from "react-router";

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
              <div className="h-6 w-px bg-gray-300" />
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
