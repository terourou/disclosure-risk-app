import Head from "next/head";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <Head>
        <title>Disclosure Risk Calculator</title>
        <meta
          name="description"
          content="Quickly and easily explore disclosure risks in a dataset. Developed by terourou.org"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center">Page</main>
    </>
  );
}
