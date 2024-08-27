import Head from "next/head";
import styles from "../styles/Home.module.css";

function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Página em Construção</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <h1>Página em Construção</h1>
      </div>

      <footer className={styles.footer}>
        <h4>Te amo Neneca, beijos no quengo &#x2764;&#xfe0f;</h4>
      </footer>
    </div>
  );
}

export default Home;
