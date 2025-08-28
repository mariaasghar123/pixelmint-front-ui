import { Loader as Spinner } from "lucide-react";

function Loader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-800 bg-opacity-70">
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-800 bg-opacity-70">
                <Spinner className="animate-spin h-12 w-12 text-green-300" />
                <span className="ml-2 text-light text-xl font-semibold">Loading...</span>
            </div>
        </div>
    );
}

export default Loader
