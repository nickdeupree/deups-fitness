import Navigation from "./components/navigation/Navigation";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-white h-screen flex flex-col">
      <Navigation />
      <main className="flex flex-col items-center justify-center flex-1">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Deup's Fitness</h1>
          <p className="text-lg text-gray-300 mb-6">Track. Improve. Achieve.</p>
        </div>
        <div className="bg-gray-700 w-[300px] h-[500px] rounded-lg mb-6 flex items-center justify-center">
          <span className="text-gray-400">App Preview Coming Soon</span>
        </div>
        <div className="flex space-x-4">
          <Link href="/signup">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full">
                Get Started
            </button>
          </Link>
          <button className="border-2 border-green-500 hover:bg-green-500 hover:text-white text-green-500 font-semibold py-2 px-6 rounded-full">
            Learn More
          </button>
        </div>
      </main>
    </div>
  );
}

