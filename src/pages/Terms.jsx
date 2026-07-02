import LegalLayout from "@/components/LegalLayout";

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="July 2, 2026">
      <Section title="1. About 404Stats">
        <p>
          404Stats is a free, non-commercial hobby project that provides live block analytics
          for Minecraft servers. It is developed and operated by <strong>404DiscNotFound</strong> on
          behalf of the <strong>404GameNotFound Community</strong>.
        </p>
        <p>
          This project has no commercial intent and generates no revenue. All features are
          available to everyone at no cost. There are no paid plans, no premium tiers, and no
          advertisements.
        </p>
      </Section>

      <Section title="2. Acceptance of Terms">
        <p>
          By installing the 404Stats plugin on your Minecraft server or by accessing any page on
          this website, you agree to these Terms of Service. If you do not agree, do not use the
          plugin or the website.
        </p>
      </Section>

      <Section title="3. The Service">
        <p>The 404Stats service includes:</p>
        <ul>
          <li>A Minecraft server plugin that collects block activity data (mined and placed blocks).</li>
          <li>Public web pages displaying server-specific statistics, leaderboards, player profiles, achievements, and activity heatmaps.</li>
          <li>Anonymous global statistics aggregated across all connected servers.</li>
        </ul>
        <p>
          The service is provided "as is" and "as available" without any warranties of any kind.
          Being a hobby project, there are no uptime guarantees or service-level agreements.
        </p>
      </Section>

      <Section title="4. No Registration Required">
        <p>
          404Stats does not require users to create an account or log in. Server statistics are
          publicly accessible via a unique server slug. No personal account data is collected from
          website visitors.
        </p>
      </Section>

      <Section title="5. Voluntary Data Submission">
        <p>
          All data processed by 404Stats is submitted voluntarily. Server owners install the plugin
          on their own servers and choose to send block activity data. Players on those servers do
          not interact with 404Stats directly — their Minecraft usernames and UUIDs are submitted
          by the server plugin as part of the block activity data.
        </p>
        <p>
          If you are a player on a server using 404Stats and do not want your data displayed, you
          may ask the server owner to remove the plugin, or use the data deletion command described
          in Section 7.
        </p>
      </Section>

      <Section title="6. Acceptable Use">
        <p>You agree not to:</p>
        <ul>
          <li>Attempt to access, modify, or delete data that does not belong to your server.</li>
          <li>Submit false, misleading, or spam data through the plugin API.</li>
          <li>Attempt to disrupt, overload, or attack the 404Stats infrastructure.</li>
          <li>Use the service for any illegal purpose.</li>
        </ul>
      </Section>

      <Section title="7. Data Deletion">
        <p>
          All submitted data is voluntary and can be deleted. Server owners can reset individual
          player data using the in-game command <code className="rounded bg-[#1A1A24] px-1.5 py-0.5 text-[#00F5FF]">/404stats reset &lt;player&gt;</code>.
        </p>
        <p>
          A full website data removal command (<code className="rounded bg-[#1A1A24] px-1.5 py-0.5 text-[#00F5FF]">/404stats nukewebsite</code>)
          is planned for a future update. Once implemented, it will allow server owners to remove
          all of their server's data from the 404Stats website.
        </p>
      </Section>

      <Section title="8. No Liability">
        <p>
          404Stats is a hobby project provided free of charge. The operator (404DiscNotFound) and
          the 404GameNotFound Community assume no liability for any damages, data loss, or service
          interruptions arising from the use of the plugin or website. You use the service at your
          own risk.
        </p>
      </Section>

      <Section title="9. Intellectual Property">
        <p>
          The 404Stats website design, branding, and code are the property of 404DiscNotFound /
          404GameNotFound. Minecraft is a trademark of Mojang Studios / Microsoft. 404Stats is not
          affiliated with or endorsed by Mojang Studios or Microsoft.
        </p>
      </Section>

      <Section title="10. Changes to These Terms">
        <p>
          These Terms may be updated at any time. Changes will be posted on this page with an
          updated "Last updated" date. Continued use of the service after changes constitutes
          acceptance of the revised Terms.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          For any questions about these Terms, reach out through the 404GameNotFound Community
          channels.
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