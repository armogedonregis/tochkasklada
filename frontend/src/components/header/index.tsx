import Link from "next/link";

export const Header = () => {
  return (
    <>
      <nav className="bg-gray-800">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-white text-xl font-bold">
                  RELE Control
                </span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    href="/panels"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Панели
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Выход
              </button>
            </div>
          </div>
        </div>
      </nav>
      <header className="bg-white shadow">
        <div className="container py-5">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Панели управления
            </h1>
          </div>
        </div>
      </header>
    </>
  );
};
