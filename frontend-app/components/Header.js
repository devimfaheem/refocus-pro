import Link from "next/link";
const Header = () => {
  return (
    <div className="Header bg-white  shadow">
      <div className="container mx-auto">
        <nav className="flex flex-wrap items-center justify-between p-4 ">
          <div className="lg:order-2 w-auto lg:w-1/5 lg:text-center">
            <a
              className="text-xl font-semibold font-heading"
              href="#"
              data-config-id="brand"
            >
              Next.js
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
