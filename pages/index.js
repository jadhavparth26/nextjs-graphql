import Head from "next/head";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LaunchIcon from "@mui/icons-material/Launch";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  useQuery,
  NetworkStatus,
} from "@apollo/client";
import Link from "next/link";
import { client, LIST_LAUNCHES } from "../query/query"
import { offsetLimitPagination } from "@apollo/client/utilities";
import { InView } from "react-intersection-observer";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [fullyLoaded, setFullyLoaded] = useState(false);
  const { data, networkStatus, error, fetchMore, variables } = useQuery(
    LIST_LAUNCHES,
    {
      client,
      notifyOnNetworkStatusChange: true,
      variables: {
        offset: 0,
        limit: 9,
      },
    }
  );
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
      {networkStatus === NetworkStatus.loading ? (
        <div class="grid h-screen place-items-center">Loading...</div>
      ) : (
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4 justify-items-center content-evenly">
          {data?.launches?.map((launch, index) => (
            <div
              key={launch.id}
              class="bg-white dark:bg-slate-800 max-w-sm rounded overflow-hidden shadow-lg"
            >
              <Link href={`/LaunchDetails/${launch.id}`}>
                <div class="px-6 pt-4 font-bold text-xl mb-2">
                  {launch.mission_name}
                </div>
              </Link>
              <hr />
              <div class="px-6 py-4 h-60 w-80 overflow-auto">
                <p class="text-slate-500 dark:text-slate-400 text-base overflow-auto">
                  {launch.details}
                </p>
              </div>
              <hr />
              <div class="px-6 pt-4 pb-2">
                <a href={launch.links.article_link} target="_blank">
                  <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    Article <LaunchIcon fontSize="small" />
                  </span>
                </a>
                <a href={launch.links.video_link} target="_blank">
                  <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    Video <LaunchIcon fontSize="small" />
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {networkStatus !== NetworkStatus.fetchMore &&
        data?.launches?.length % variables.limit === 0 &&
        !fullyLoaded && (
          <InView
            onChange={async (inView) => {
              if (inView) {
                const result = await fetchMore({
                  variables: {
                    offset: data.launches.length,
                    limit: data.launches.length + 9,
                  },
                });
                setFullyLoaded(!result.data.launches.length);
              }
            }}
          />
        )}
      {data?.launches?.length > 0 && (
        <div className="loading">
          <h2 className="text-gray-300">Loading...</h2>
        </div>
      )}
    </>
  );
}
