import { useQuery } from "@apollo/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { client, LAUNCH_DETAILS } from "../../query/query";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useTheme } from "next-themes";
export default function LaunchDetails() {
  const { theme, setTheme } = useTheme();

  const router = useRouter();
  const { id } = router.query;
  const { data, networkStatus, error, variables } = useQuery(LAUNCH_DETAILS, {
    client,
    notifyOnNetworkStatusChange: true,
    variables: {
      launchId: id,
    },
  });
  console.log(data);
  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <>
      <Head>
        <title>Spacex Project</title>
      </Head>
      <nav className="flex justify-between px-2 sm:px-4 py-2.5  w-full z-[1] top-0 left-0 border-b border-gray-200 dark:border-gray-600">
        <h2 className="text-3xl font-bold">SpaceX</h2>
        <button
          aria-label="Toggle Dark Mode"
          type="button"
          className="p-3 h-12 w-12 order-2 md:order-3"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "light" ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon />
          )}
        </button>
      </nav>
      {data ? (
        <div className="p-8 mt-10 grid grid-cols-1 lg:grid-cols-1  justify-items-center content-evenly">
          <div className="w-6/12" style={{ width: "250px" }}>
            <h1>Mission Name : {data?.launch?.mission_name}</h1>
            <hr />
            <br />
            <h3>
              Date of Launch:{" "}
              {new Date(data?.launch?.launch_date_local).toLocaleDateString(
                "en-US"
              )}
            </h3>
            <hr />
            <br />
            <p>
              Details :{" "}
              {data?.launch?.details
                ? data?.launch?.details
                : "No Details Available"}
            </p>
          </div>
        </div>
      ) : (
        <div class="grid h-screen place-items-center">Loading...</div>
      )}
    </>
  );
}
