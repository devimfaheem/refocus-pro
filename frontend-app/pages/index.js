// pages/index.js
import Link from "next/link";

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">
        Welcome to the User Management application
      </h1>
      <p className="mt-4">
        <Link href="/login">
          <a className="text-blue-500">Login Page</a>
        </Link>
      </p>
    </div>
  );
};

export default Home;
