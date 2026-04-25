import Sidebar from "../common/Sidebar";
import TopNavbar from "../common/TopNavbar";

const AppLayout = ({ children }) => {
  return (
    <div className="antialiased min-h-screen flex selection:bg-primary-container selection:text-on-primary-container">
      <Sidebar />
      {/* Main wrapper */}
      <div className="flex-1 ml-64 flex flex-col relative min-h-screen">
        <TopNavbar />
        <main className="flex-1 pt-24 px-8 pb-xxl max-w-[1280px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
