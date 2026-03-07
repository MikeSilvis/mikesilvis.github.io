import React, { useState } from 'react';
import PageShell from '../../components/PageShell';
import HeroHeader from '../../components/HeroHeader';
import StickyTabNav from '../../components/StickyTabNav';
import TabSection from '../../components/TabSection';
import useLiveResults from './hooks/useLiveResults';
import OverviewTab from './tabs/OverviewTab';
import ScheduleTab from './tabs/ScheduleTab';
import WeightsTab from './tabs/WeightsTab';
import TeamsTab from './tabs/TeamsTab';
import styles from './Wrestling.module.css';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'weights', label: 'Weight Classes' },
  { id: 'teams', label: 'Teams' },
];

const HERO_STATS = [
  { value: '14', label: 'Teams' },
  { value: '10', label: 'Weight Classes' },
  { value: '5', label: 'Sessions' },
  { value: '2', label: 'Days' },
];

export default function Wrestling() {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    liveResults,
    liveDataLoaded,
    statusText,
    statusTime,
  } = useLiveResults();

  return (
    <PageShell className={styles.page}>
      <HeroHeader
        badge="112th Big Ten Wrestling Championships"
        title="Big Ten Wrestling Championships"
        subtitle="March 7-8, 2026 &bull; Bryce Jordan Center &bull; State College, PA"
        stats={HERO_STATS}
        accentColor="#c4a44a"
        backgroundPattern="circles"
      />

      <div className={styles.liveBanner}>
        <span className={styles.liveDot} />
        <span
          className={styles.liveText}
          dangerouslySetInnerHTML={{ __html: statusText }}
        />
        {statusTime && (
          <span className={styles.liveStatus}>{statusTime}</span>
        )}
      </div>

      <StickyTabNav
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        accentColor="#c4a44a"
      />

      <main className={styles.main}>
        <TabSection id="overview" active={activeTab === 'overview'}>
          <OverviewTab liveResults={liveResults} liveDataLoaded={liveDataLoaded} />
        </TabSection>

        <TabSection id="schedule" active={activeTab === 'schedule'}>
          <ScheduleTab />
        </TabSection>

        <TabSection id="weights" active={activeTab === 'weights'}>
          <WeightsTab liveResults={liveResults} liveDataLoaded={liveDataLoaded} />
        </TabSection>

        <TabSection id="teams" active={activeTab === 'teams'}>
          <TeamsTab />
        </TabSection>
      </main>

      <footer className={styles.footer}>
        <strong>2026 Big Ten Wrestling Championships</strong>
        <br />
        March 7-8, 2026 &bull; Bryce Jordan Center, State College, PA
        <br />
        Broadcast on BTN &amp; B1G+ &bull; Follow{' '}
        <a
          href="https://instagram.com/b1gwrestling"
          target="_blank"
          rel="noopener"
          className={styles.footerLink}
        >
          @b1gwrestling
        </a>
      </footer>
    </PageShell>
  );
}
