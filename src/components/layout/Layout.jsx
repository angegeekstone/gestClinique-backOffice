import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--surface-app)' }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Content shifts right on lg+ to clear the fixed sidebar */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-[264px]">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
