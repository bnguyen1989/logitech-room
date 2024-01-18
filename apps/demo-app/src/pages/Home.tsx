// simple react home page

import type React from 'react';
import { Helmet as Head } from 'react-helmet';

import { pages } from '../pages.js';

export const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="home">
        <div className="container mx-auto">
          <img src="/logos/threekit_color.png" alt="logo" className="w-32" />
          <h1 className="text-3xl font-bold">Home</h1>
          <p>Available demo pages:</p>
          <ul className="space-y-4 list-disc list-inside">
            {pages
              .filter((page) => !page.special)
              .map((page) => {
                console.log(page);
                return (
                  <>
                    <li key={page.path}>
                      <a
                        href={`./${page.path}`}
                        className="text-blue-500 hover:underline"
                      >
                        {`${page.title}: ${page.path}`}
                      </a>
                    </li>
                    {page.examples ? (
                      <ul className="ps-5 mt-2 space-y-1 list-disc list-inside">
                        {page.examples.map((example) => {
                          console.log(example);
                          const urlParams = new URLSearchParams(example.params);
                          return (
                            <li key={page.path + urlParams.toString()}>
                              <a
                                href={`./${page.path}?${urlParams.toString()}`}
                                className="text-blue-500 hover:underline"
                              >
                                {`${example.title}`}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
};
