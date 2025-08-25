import Sidebar from "@/components/Panel/Sidebar";
import Header from "@/components/Panel/Header";

export default function Layout({ children }) {
    return (
        <div className="flex min-h-[100dvh] w-full p-4 gap-4">
            <Sidebar />
            <div className="flex-1">
                <Header />
                {children}
            </div>
        </div>
    );
}
