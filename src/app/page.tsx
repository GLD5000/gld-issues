import GitTasks from "@/components/github/GitTasks";
import { showLoginPage } from "../auth/auth";
import LoginPage from "./login/LoginPage";


export default async function page() {
    const { shouldShowLogin } = await showLoginPage();
    if (shouldShowLogin) return <LoginPage />;

    return <GitTasks />;
}
