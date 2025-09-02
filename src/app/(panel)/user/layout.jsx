import ProtectedRoute from "@/components/ProtectedRoute";

export default function Layout({ children }) {
    return (
        <ProtectedRoute allowedRoles={['user', 'admin']}>
            {children}
        </ProtectedRoute>
    );
}
