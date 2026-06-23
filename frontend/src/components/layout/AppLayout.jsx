import Sidebar from "../common/Sidebar";
import TopNavbar from "../common/TopNavbar";

const AppLayout = ({ children }) => {
  return (
    <div className="antialiased min-h-screen flex selection:bg-primary-container selection:text-on-primary-container">
      <Sidebar />
      <div className="relative ml-64 flex min-h-screen flex-1 flex-col bg-background">
        <TopNavbar />
        <main className="mx-auto flex-1 w-full max-w-[1280px] px-6 pb-xxl pt-24 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
