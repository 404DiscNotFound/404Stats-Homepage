import LegalLayout from "@/components/LegalLayout";

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="July 2, 2026">
      <Section title="1. Who We Are">
        <p>
          404Stats is a free, non-commercial hobby project operated by <strong>404DiscNotFound</strong>
          on behalf of the <strong>404GameNotFound Community</strong>. It collects and displays
          Minecraft server block activity statistics. This project has no profit intent, no
          advertising, and no commercial purpose.
        </p>
      </Section>

      <Section title="2. What Data We Collect">
        <p>The following data is collected when a server owner installs and runs the 404Stats plugin:</p>
        <ul>
          <li><strong>IP Address:</strong> The Minecraft server's IP address is used to identify and associate the server with its data.</li>
          <li><strong>Minecraft Player Names:</strong> In-game usernames of players who mine or place blocks on a connected server.</li>
          <li><strong>Minecraft Player UUIDs:</strong> The unique identifiers assigned to players by Minecraft/Mojang, used to reliably track per-player statistics.</li>
          <li><strong>Server Statistics:</strong> Block activity data — which blocks were mined or placed, how many, and when. This includes the material type, count, day, and hour of activity.</li>
          <li><strong>Anonymous Aggregate Statistics:</strong> Combined, anonymized statistics across all servers (e.g., total blocks tracked globally). These contain no server-specific or player-specific identifiers.</li>
        </ul>
      </Section>

      <Section title="3. What We Do Not Collect or Track">
        <p>404Stats explicitly does <strong>not</strong> do the following:</p>
        <ul>
          <li>Track persons, real names, or any real-world personal identity data.</li>
          <li>Track website visitors with analytics, cookies, or fingerprinting.</li>
          <li>Sell, share, or pass on any data to advertisers, advertising networks, or third-party marketers.</li>
          <li>Collect email addresses, passwords, or any account credentials — there are no user accounts.</li>
          <li>Track browsing behavior across pages or other websites.</li>
        </ul>
        <p>
          Minecraft player names and UUIDs are not considered personal data by 404Stats — they are
          in-game identifiers used solely for displaying game statistics on the respective server's
          public page.
        </p>
      </Section>

      <Section title="5. How Data Is Used">
        <p>Collected data is used exclusively for:</p>
        <ul>
          <li>Displaying block activity statistics on the server's public 404Stats page.</li>
          <li>Generating leaderboards, player profiles, achievements, and activity heatmaps.</li>
          <li>Producing fully anonymized global aggregate statistics (no individual server or player identifiable).</li>
        </ul>
        <p>
          Data is never used for advertising, profiling, or commercial purposes. No data is sold or
          shared with any third party.
        </p>
      </Section>

      <Section title="6. Voluntary Data & Consent">
        <p>
          All data submission is entirely voluntary. Server owners choose to install the plugin and
          send data. Players do not directly interact with 404Stats — their in-game names and UUIDs
          are included automatically by the plugin as part of block activity records on servers where
          they play.
        </p>
        <p>
          If you are a player and do not want your Minecraft name or UUID displayed on a 404Stats
          server page, you may ask the server owner to remove the plugin, or request data deletion
          (see Section 7).
        </p>
      </Section>

      <Section title="7. Data Deletion">
        <p>
          All data is voluntary and can be deleted at any time:
        </p>
        <ul>
          <li>
            <strong>Individual player reset:</strong> Server owners can delete a specific player's
            data with the in-game command <code className="rounded bg-[#1A1A24] px-1.5 py-0.5 text-[#00F5FF]">/404stats reset &lt;player&gt;</code>.
          </li>
          <li>
            <strong>Full website data removal:</strong> The command
            <code className="rounded bg-[#1A1A24] px-1.5 py-0.5 text-[#00F5FF]">/404stats nukewebsite</code>
            is planned for a future update and will allow server owners to remove all of their
            server's data from the 404Stats website. This feature is not yet implemented.
          </li>
        </ul>
      </Section>

      <Section title="8. No Cookies or Tracking Technologies">
        <p>
          The 404Stats website does not use tracking cookies, analytics scripts, advertising
          pixels, or any third-party tracking technologies. No browsing behavior is monitored.
        </p>
      </Section>

      <Section title="9. Data Storage">
        <p>
          Data is stored on the 404Stats platform infrastructure. As this is a hobby project with no
          commercial backing, no specific data retention guarantees apply. Data persists until
          deleted by the server owner via the available or planned deletion commands.
        </p>
      </Section>

      <Section title="10. Children's Privacy">
        <p>
          Minecraft is played by users of various ages. 404Stats collects only in-game identifiers
          (Minecraft names and UUIDs) and block activity data — no real-world personal information.
          Server owners are responsible for informing their players that the server uses 404Stats
          and that block activity data is publicly displayed.
        </p>
      </Section>

      <Section title="11. Third-Party Services">
        <p>
          Player head images are loaded from <strong>mc-heads.net</strong>, a third-party service
          that renders Minecraft avatars from UUIDs. When a 404Stats page is loaded, the browser
          may request images from mc-heads.net. 404Stats has no control over mc-heads.net's data
          practices. No other third-party services are used.
        </p>
      </Section>

      <Section title="12. Changes to This Policy">
        <p>
          This Privacy Policy may be updated at any time. Changes will be posted on this page with an
          updated "Last updated" date.
        </p>
      </Section>

      <Section title="13. Contact">
        <p>
          For privacy questions or data deletion requests, reach out through the 404GameNotFound
          Community channels or ask your server owner to use the in-game deletion commands.
        </p>
      </Section>
    </LegalLayout>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-[#00F5FF]">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 [&_code]:text-xs [&_li]:ml-4 [&_li]:list-disc [&_li]:marker:text-gray-700 [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  );
}