export default function Page() {
  return (
    <div className="container prose prose-slate mx-auto pb-20">
      <p className="lead">
        Our <em>Disclosure Risk Calculator</em> allows anyone to quickly and
        easily explore disclosure risks in a dataset. The data is stored in your
        browser unless you explicitly ask to upload it to our server for more
        detailed results.
      </p>

      <p>
        Elliott, Milne, Roberts, Simpson, and Sporle (2022).{" "}
        <em>Disclosure Risk Calculator</em>.{" "}
        <a href="https://risk.terourou.org">https://risk.terourou.org</a>.
      </p>

      <h2>What it does</h2>

      <p>
        The app reads the dataset and asks you to choose a selection of
        variables that might be used for identification and provide a population
        size or sampling fraction.
      </p>

      <ul>
        <li>
          <strong>Population size</strong>: the total size of the population the
          data was collected from (e.g., if the data is a sample of adults, this
          is the total number of adults in the population).
        </li>
        <li>
          <strong>Sampling fraction</strong>: the fraction of the population
          included in the sample (e.g., the fraction of adults in your sample).
        </li>
      </ul>

      <p>
        Using the chosen variables, the software calculates the number of unique
        combinations (i.e., individuals in the sample with a unique set of
        responses for the chosen variables) and pairs of combinations. This is
        combined with the sampling fraction to calculate the disclosure risk.
      </p>

      <p>
        Since this calculation is simple, it can be performed in your browser
        without uploading the data to our server.
      </p>

      <h4>Uploading data for extra details</h4>

      <p>
        If you choose to upload your data to the server by clicking the
        &lsquo;Upload&rsquo; button, the encrypted version of the data (in which
        values are replaced by random labels) is uploaded to a secure process
        that only your current connection can access. It then makes use of
        functions from the &lsquo;sdcMicro&rsquo; R package to calculate:
      </p>

      <ul>
        <li>
          <strong>Variable contributions</strong>: the percentage of the
          estimated disclosure risk that is attributed by each variable;
        </li>
        <li>
          <strong>Individual disclosure risks</strong>: the disclosure risk of
          each row/individual in the dataset, displayed in a table ordered from
          highest risk to lowest.
        </li>
      </ul>

      <p>
        You can adjust the chosen variables and sampling fraction to see the
        effect on the estimated disclosure risk(s).
      </p>

      <p>
        Once you close your browser, the data will be released from memory and
        deleted.
      </p>

      <h2>How it works</h2>

      <p>
        We have an R server running using{" "}
        <a href="https://www.rforge.net/Rserve/">Rserve</a> that the client
        (your browser) can connected to using <em>websockets</em>. When you load
        the app, the websocket connection creates a new R instance on the server
        that is tied directly to your connection &mdash; once the websocket
        closes (i.e., if you close your browser or refresh the page) the
        associated R session is killed and any data contained within it is lost.
        Importantly, noone else can access this R session.
      </p>

      <p>
        Once the connection is made and the user clicks the &lsquo;Upload&rsquo;
        button, the encrypted version of the data is sent to the R process and
        stored <em>in memory</em> as an R dataframe. The process then returns a
        function (<code>calculate_risk()</code>) which can be called by your app
        session (and only yours) to estimate the risk information. This function
        is scoped, so the data is availble to it but doesn&apos;t need to be
        re-uploaded each time.
      </p>

      <p>
        If you want more details on how this all works, this project is
        completely open-source:
      </p>

      <p className="text-center">
        <a
          href="https://github.com/terourou/disclosure-risk-app"
          className="bg-green-400 px-4 py-2 text-green-900 decoration-transparent shadow"
        >
          View on GitHub
        </a>
      </p>

      <p>
        If you have questions to feedback, please either open an issue on Github
        or send us an email at{" "}
        <a href="mailto:terourounz@gmail.com">terourounz@gmail.com</a>.
      </p>
    </div>
  );
}
