import { useRouter } from 'next/router';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn'); // Remove the login state
        router.push('/admin/login'); // Redirect to login page
    };

    return <button onClick={handleLogout}>Logout</button>;
}
