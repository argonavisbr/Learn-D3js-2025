import Tabs from './Tabs.jsx';
import Viz1 from './vizcomponents/Viz1.jsx';
import Viz2 from './vizcomponents/Viz2.jsx';
import Viz3 from './vizcomponents/Viz3.jsx';
import Viz4 from './vizcomponents/Viz4.jsx';
import Viz5 from './vizcomponents/Viz5.jsx';
import '../../css/maps.css';

export default function App() {
  const tabs = [
    { key: 'viz1', title: 'Brush + Zoom', content: <Viz1 /> },
    { key: 'viz2', title: 'Force bubbles', content: <Viz2 /> },
    { key: 'viz3', title: 'Globe inertia', content: <Viz3 /> },
    { key: 'viz4', title: 'Global warming spiral', content: <Viz4 /> },
    { key: 'viz5', title: 'Band scale', content: <Viz5 /> },
  ];

  return (
    <main style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 16, border: 'solid 1px gray' }}>
      <p>
        This page runs all visualizations inside a single React application. Each tab mounts the
        corresponding D3 visualization into an isolated container using a <code>ref</code> and
        <code>useEffect</code> with proper cleanup to avoid duplicate SVGs or event handlers.
      </p>
      <Tabs tabs={tabs} />
    </main>
  );
}
