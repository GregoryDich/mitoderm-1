import { FC } from 'react';
import { getTranslations } from 'next-intl/server';
import AdminLogin from '@/components/Admin/AdminLogin/AdminLogin';

export async function generateMetadata() {
  const t = await getTranslations('admin');
  return {
    title: `Mitoderm | ${t('title')}`,
    description: t('description'),
  };
}

const AdminPage: FC = () => {
  return (
    <div className="formPage">
      <AdminLogin />
    </div>
  );
};

export default AdminPage; 