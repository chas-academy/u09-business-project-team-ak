import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from './components/Footer';


export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#121c14] text-gray-900">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
