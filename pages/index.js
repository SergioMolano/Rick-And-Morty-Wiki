import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion'; 
import dynamic from 'next/dynamic';
//npm run dev

//Source Endpoint 
const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;

//Async Request
export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint);
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

//Event Handlers
export default function Home({ data }) {
  const { info, results: defaultResults = [] } = data;

  const [results, updateResults] = useState(defaultResults);

  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint,
  });
  const { current } = page;

  //UI Refresh
  useEffect(() => {

    if (current === defaultEndpoint) return;

    async function request() {
      const res = await fetch(current);
      const nextData = await res.json();

      updatePage({
        current,
        ...nextData.info,
      });

      if (!nextData.info?.prev) {
        updateResults(nextData.results);
        return;
      }

      updateResults((prev) => {
        return [...prev, ...nextData.results];
      });
    }

    request();
  }, [current]);

  function handleLoadMore() {
    updatePage((prev) => {
      return {
        ...prev,
        current: page?.next,
      };
    });
  }

  //Search an Specific Character
  function handleOnSubmitSearch(e) {
    e.preventDefault();

    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find((field) => field.name === 'query');

    const value = fieldQuery.value || '';
    const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;

    updatePage({
      current: endpoint,
    });
  }

  //Styles Used
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {
              scale: 0.8,
              opacity: 0,
            },
            visible: {
              scale: 1,
              opacity: 1,
              transition: {
                delay: 0.4,
              },
            },
          }}
        >
          <h1 className="title">Rick and Morty Character Wiki</h1>
        </motion.div>

        <p className="description">
          Know Your Characters
        </p>

        <form className="search" onSubmit={handleOnSubmitSearch}>
          <input name="query" type="search" />
          <button>Search</button>
        </form>

        <ul className="grid">
          {results.map(result => {
            const { id, name, image } = result;
            return (
              <motion.li key={id} className="card" whileHover={{
                position: 'relative',
                zIndex: 1,
                background: 'white',
                scale: [1, 1.4, 1.2],
                rotate: [0, 10, -10, 0],
                filter: [
                  'hue-rotate(0) contrast(100%)',
                  'hue-rotate(360deg) contrast(200%)',
                  'hue-rotate(45deg) contrast(300%)',
                  'hue-rotate(0) contrast(100%)'
                ],
                transition: {
                  duration: .2
                }
              }}>
                <Link href="/character/[id]" as={`/character/${id}`}>
                  <div> {/* Replace <a> with <div> */}
                    <img src={image} alt={`${name} Thumbnail`} />
                    <h3>{name}</h3>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>


        <p>
          <button onClick={handleLoadMore}>Load More Characters</button>
        </p>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
        </a>
      </footer>

      

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}