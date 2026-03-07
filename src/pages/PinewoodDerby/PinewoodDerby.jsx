import { useState } from 'react';
import PageShell from '../../components/PageShell';
import HeroHeader from '../../components/HeroHeader';
import StickyTabNav from '../../components/StickyTabNav';
import TabSection from '../../components/TabSection';
import IntroTab from './tabs/IntroTab';
import SpecsTab from './tabs/SpecsTab';
import WeightTab from './tabs/WeightTab';
import AeroTab from './tabs/AeroTab';
import WheelsTab from './tabs/WheelsTab';
import StabilityTab from './tabs/StabilityTab';
import ChecklistTab from './tabs/ChecklistTab';
import styles from './PinewoodDerby.module.css';

const ACCENT = '#f97316';

const TABS = [
  { id: 'intro', label: '🏁 Intro' },
  { id: 'specs', label: '📐 Specs' },
  { id: 'weight', label: '⚖️ Weight & CoG' },
  { id: 'aero', label: '💨 Aerodynamics' },
  { id: 'wheels', label: '🔧 Wheels & Axles' },
  { id: 'stability', label: '🎯 Stability' },
  { id: 'checklist', label: '✅ Checklist' },
];

const STATS = [
  { value: '5.00', label: 'oz max weight' },
  { value: '7"', label: 'max length' },
  { value: '~1"', label: 'ideal CoG offset' },
  { value: '4', label: 'key factors' },
];

export default function PinewoodDerby() {
  const [activeTab, setActiveTab] = useState('intro');

  return (
    <PageShell className={styles.page} style={{ '--accent': ACCENT }}>
      <HeroHeader
        badge="BSA Cub Scout Racing · Physics-Optimized Guide"
        title="Pinewood<br>Derby"
        subtitle="The complete physics-based guide to building the fastest legal car on the track."
        stats={STATS}
        accentColor={ACCENT}
      />

      <StickyTabNav
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        accentColor={ACCENT}
      />

      <main className={styles.main}>
        <TabSection id="tab-intro" active={activeTab === 'intro'}>
          <IntroTab />
        </TabSection>

        <TabSection id="tab-specs" active={activeTab === 'specs'}>
          <SpecsTab />
        </TabSection>

        <TabSection id="tab-weight" active={activeTab === 'weight'}>
          <WeightTab />
        </TabSection>

        <TabSection id="tab-aero" active={activeTab === 'aero'}>
          <AeroTab />
        </TabSection>

        <TabSection id="tab-wheels" active={activeTab === 'wheels'}>
          <WheelsTab />
        </TabSection>

        <TabSection id="tab-stability" active={activeTab === 'stability'}>
          <StabilityTab />
        </TabSection>

        <TabSection id="tab-checklist" active={activeTab === 'checklist'}>
          <ChecklistTab />
        </TabSection>
      </main>

      <footer className={styles.footer}>
        <p>
          {'🏎️'} Based on <span className={styles.footerAccent}>physics principles</span> and racer
          consensus — always test your own car!
        </p>
        <p style={{ marginTop: '0.4rem', fontSize: '0.72rem' }}>
          Results vary by track, rules, and build execution. Verify all modifications against your
          local BSA pack rules before race day.
        </p>
      </footer>
    </PageShell>
  );
}
