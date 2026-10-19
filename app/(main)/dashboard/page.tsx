import { checkUser } from "@/actions/check-user";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const user = await checkUser();
  if (!user) redirect("/sign-in");
  return (
    <div>
      <h1 className="text-2xl font-bold">
        Welcome, {user.name ?? user.email} !!
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your user id in our database : {user.id}
      </p>
    </div>
  );
};

export default DashboardPage;
