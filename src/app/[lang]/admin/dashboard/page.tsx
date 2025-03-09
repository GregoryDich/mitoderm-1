import { FC } from 'react';
import { getTranslations } from 'next-intl/server';
import AdminDashboard from '@/components/Admin/AdminDashboard/AdminDashboard';

export async function generateMetadata() {
  const t = await getTranslations('admin');
  return {
    title: `Mitoderm | ${t('dashboard')}`,
    description: t('dashboardDescription'),
  };
}

const AdminDashboardPage: FC = () => {
  return (
    <div className="formPage">
      <AdminDashboard />
    </div>
  );
};

export default AdminDashboardPage; 