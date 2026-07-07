import LegalLayout from "@/components/LegalLayout";
import { useT } from "@/lib/i18n";

export default function Privacy() {
  const t = useT();
  return (
    <LegalLayout title={t("legal.privacyPolicy")} lastUpdated="July 5, 2026">
      <Section title="1. Who We Are">
        <p>
          404Stats is a free, non-commercial hobby project developed by <strong>404DiscNotFound</strong>
          on behalf of the <strong>404GameNotFound Community</strong>. It is a self-hosted Minecraft
          statistics plugin — everything runs locally on your own Minecraft server.
        </p>
      </Section>

      <Section title="2. Local H2 Database">
        <p>
          All statistics are stored in a local H2 database file inside your server's
          <code className="rounded bg-[#3D3D3D] px-1.5 py-0.5 text-[#5BA033]">plugins/404Stats/</code>
          directory. No data leaves your server — there is no cloud sync, no external database, and
          no central server collecting your players' data.
        </p>
        <p>
          The database file (<code className="rounded bg-[#3D3D3D] px-1.5 py-0.5 text-[#5BA033]">404stats.mv.db</code>)
          is fully under your control. You can back it up, delete it, or inspect it at any time.
        </p>
      </Section>

      <Section title="3. What Data Is Stored">
        <p>The plugin stores the following Minecraft data locally on your server:</p>
        <ul>
          <li><strong>Minecraft Player Names and UUIDs</strong> — in-game identifiers used to track per-player statistics.</li>
          <li><strong>Block Activity</strong> — which blocks were mined or placed, by whom, in which world, game mode, and project.</li>
          <li><strong>NPC Combat</strong> — kills and deaths against mobs and NPCs, including weapons used.</li>
          <li><strong>Movement</strong> — distance traveled per movement type, biome, and mount.</li>
          <li><strong>Production</strong> — crafting, smelting, smithing, and stonecutting output.</li>
          <li><strong>Interactions</strong> — player interactions with blocks, entities, animals, and buckets.</li>
          <li><strong>World Metadata</strong> — world environment, type, and first-seen timestamps.</li>
          <li><strong>Project Metadata</strong> — community project names and membership.</li>
        </ul>
        <p>
          Minecraft player names and UUIDs are in-game identifiers, not real-world personal data.
          They are used solely for displaying game statistics on your server's local web panel.
        </p>
      </Section>

      <Section title="4. What We Do Not Collect">
        <p>404Stats explicitly does <strong>not</strong> do the following:</p>
        <ul>
          <li>Send any data to external servers, clouds, or third-party APIs.</li>
          <li>Track website visitors with analytics, cookies, or fingerprinting.</li>
          <li>Collect email addresses, passwords, or any account credentials.</li>
          <li>Sell, share, or pass on any data to advertisers or third parties.</li>
          <li>Use browser localStorage, sessionStorage, or IndexedDB in the web panel.</li>
          <li>Embed third-party social media widgets or share buttons with tracking.</li>
        </ul>
      </Section>

      <Section title="5. Web Panel">
        <p>
          The built-in web panel is served directly from your Minecraft server. It is designed for
          desktop and mobile screens and does not hotlink block icons or player heads from
          third-party CDNs — all assets are served locally from the plugin's internal webserver.
        </p>
        <p>
          The web panel does not use browser <code className="rounded bg-[#3D3D3D] px-1.5 py-0.5 text-[#5BA033]">localStorage</code>,
          <code className="rounded bg-[#3D3D3D] px-1.5 py-0.5 text-[#5BA033]">sessionStorage</code>, or
          <code className="rounded bg-[#3D3D3D] px-1.5 py-0.5 text-[#5BA033]">IndexedDB</code>. No embedded
          third-party share widgets are used.
        </p>
        <p>
          Server owners can optionally protect the web panel with a password. When enabled, session
          tokens are stored in HttpOnly, SameSite=Lax cookies.
        </p>
      </Section>

      <Section title="6. Admin Panel Security">
        <p>
          The admin panel at <code className="rounded bg-[#3D3D3D] px-1.5 py-0.5 text-[#5BA033]">/admin</code>
          allows database management without a password — access is granted through a single-use login
          token generated in-game with <code className="rounded bg-[#3D3D3D] px-1.5 py-0.5 text-[#5BA033]">/404stats webadmin</code>.
        </p>
        <ul>
          <li>Login tokens are valid for 5 minutes, single-use, and SHA-256 hashed.</li>
          <li>Sessions are valid for 30 minutes, stored in HttpOnly, SameSite=Lax cookies.</li>
          <li>All write operations require CSRF protection.</li>
          <li>Rate limiting: max 5 login attempts per 10 seconds per IP.</li>
          <li>Two-step delete with confirmation for all database operations.</li>
        </ul>
      </Section>

      <Section title="7. bStats Anonymous Metrics">
        <p>
          404Stats uses <strong>bStats</strong> for anonymous plugin metrics. bStats collects
          anonymous usage data (such as server count, player count, and Minecraft version) to
          help developers understand how the plugin is used. This data is fully anonymized and
          does not include any player-specific or server-specific identifiers.
        </p>
        <p>
          You can review bStats' privacy policy at{" "}
          <a href="https://bstats.org/privacy" target="_blank" rel="noopener noreferrer" className="text-[#5BA033] hover:underline">bstats.org/privacy</a>.
          bStats can be disabled in the plugin configuration if desired.
        </p>
      </Section>

      <Section title="8. Optional Minecraft Textures">
        <p>
          By default, the web panel uses emoji icons for blocks, entities, and items. Optionally,
          server owners can enable Minecraft texture icons by downloading the Mojang client JAR
          textures. This is disabled by default and requires accepting the Mojang/Microsoft asset
          terms. When enabled, textures are cached locally on the server — no browser hotlinks to
          third-party CDNs.
        </p>
      </Section>

      <Section title="9. Data Control">
        <p>
          Since all data is stored locally on your Minecraft server, you have full control at all
          times. To delete data, you can:
        </p>
        <ul>
          <li>Use the admin panel to browse, search, and delete entries across all database tables.</li>
          <li>Delete specific player data via in-game commands.</li>
          <li>Delete the entire H2 database file to wipe all statistics.</li>
        </ul>
        <p>
          If you are a player on a server using 404Stats and do not want your data displayed, ask
          the server owner to remove the plugin or reset your data.
        </p>
      </Section>

      <Section title="10. No Liability">
        <p>
          404Stats is a hobby project provided free of charge. The developer (404DiscNotFound) and
          the 404GameNotFound Community assume no liability for any damages, data loss, or service
          interruptions arising from the use of the plugin. You use the service at your own risk.
        </p>
      </Section>

      <Section title="11. Changes to This Policy">
        <p>
          This Privacy Policy may be updated at any time. Changes will be posted on this page with
          an updated "Last updated" date.
        </p>
      </Section>

      <Section title="12. Contact">
        <p>
          For privacy questions, reach out through the 404GameNotFound Community channels (Discord,
          GitHub, or the community website).
        </p>
      </Section>
    </LegalLayout>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-[#5BA033]">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 [&_code]:text-xs [&_li]:ml-4 [&_li]:list-disc [&_li]:marker:text-[#444444] [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  );
}