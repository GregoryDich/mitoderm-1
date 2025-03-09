'use client';
import { FC, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import styles from './AnalyticsManager.module.scss';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  topPages: Array<{ path: string; views: number }>;
  formSubmissions: {
    total: number;
    byType: {
      contact: number;
      event: number;
      other: number;
    };
    successful: number;
  };
  conversionRate: number;
  visitorsByDevice?: Record<string, number>;
  visitorsByCountry?: Record<string, number>;
}

const DEFAULT_ANALYTICS_DATA: AnalyticsData = {
  pageViews: 0,
  uniqueVisitors: 0,
  topPages: [],
  formSubmissions: {
    total: 0,
    byType: {
      contact: 0,
      event: 0,
      other: 0
    },
    successful: 0
  },
  conversionRate: 0
};

type DatePeriod = '7days' | '30days' | '90days' | 'all' | 'custom';

const AnalyticsManager: FC = () => {
  const t = useTranslations('admin');
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(DEFAULT_ANALYTICS_DATA);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState<DatePeriod>('7days');
  const [customDates, setCustomDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  useEffect(() => {
    if (period !== 'custom') {
      fetchAnalyticsData(period);
    }
  }, [period]);

  const fetchAnalyticsData = async (selectedPeriod: DatePeriod, customRange?: { startDate: string; endDate: string }) => {
    setIsLoading(true);
    try {
      let url = `/api/analytics?period=${selectedPeriod}`;
      
      if (selectedPeriod === 'custom' && customRange) {
        url += `&startDate=${customRange.startDate}&endDate=${customRange.endDate}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setAnalyticsData(data.data);
      } else {
        setError(t('errorFetchingAnalytics'));
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(t('errorFetchingAnalytics'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (selectedPeriod: DatePeriod) => {
    setPeriod(selectedPeriod);
    if (selectedPeriod === 'custom') {
      setShowCustomDatePicker(true);
    } else {
      setShowCustomDatePicker(false);
    }
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomDates(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyCustomDates = () => {
    if (customDates.startDate && customDates.endDate) {
      fetchAnalyticsData('custom', customDates);
    }
  };

  // Расчет процента успешных отправок форм
  const successRate = analyticsData.formSubmissions.total > 0
    ? Math.round((analyticsData.formSubmissions.successful / analyticsData.formSubmissions.total) * 100)
    : 0;

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>{t('manageAnalytics')}</h2>
      
      <div className={styles.periodSelector}>
        <button 
          className={`${styles.periodButton} ${period === '7days' ? styles.active : ''}`} 
          onClick={() => handlePeriodChange('7days')}
        >
          {t('period7days')}
        </button>
        <button 
          className={`${styles.periodButton} ${period === '30days' ? styles.active : ''}`} 
          onClick={() => handlePeriodChange('30days')}
        >
          {t('period30days')}
        </button>
        <button 
          className={`${styles.periodButton} ${period === '90days' ? styles.active : ''}`} 
          onClick={() => handlePeriodChange('90days')}
        >
          {t('period90days')}
        </button>
        <button 
          className={`${styles.periodButton} ${period === 'all' ? styles.active : ''}`} 
          onClick={() => handlePeriodChange('all')}
        >
          {t('periodAll')}
        </button>
        <button 
          className={`${styles.periodButton} ${period === 'custom' ? styles.active : ''}`} 
          onClick={() => handlePeriodChange('custom')}
        >
          {t('customDateRange')}
        </button>
      </div>
      
      {showCustomDatePicker && (
        <div className={styles.customDatePicker}>
          <div className={styles.dateInputGroup}>
            <label htmlFor="startDate">{t('startDate')}</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={customDates.startDate}
              onChange={handleCustomDateChange}
            />
          </div>
          <div className={styles.dateInputGroup}>
            <label htmlFor="endDate">{t('endDate')}</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={customDates.endDate}
              onChange={handleCustomDateChange}
            />
          </div>
          <button 
            className={styles.applyButton}
            onClick={handleApplyCustomDates}
            disabled={!customDates.startDate || !customDates.endDate}
          >
            {t('apply')}
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div className={styles.loading}>{t('loading')}</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.analyticsContainer}>
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <h3>{t('pageViews')}</h3>
              <div className={styles.statValue}>{analyticsData.pageViews.toLocaleString()}</div>
            </div>
            <div className={styles.statCard}>
              <h3>{t('uniqueVisitors')}</h3>
              <div className={styles.statValue}>{analyticsData.uniqueVisitors.toLocaleString()}</div>
            </div>
            <div className={styles.statCard}>
              <h3>{t('formSubmissions')}</h3>
              <div className={styles.statValue}>{analyticsData.formSubmissions.total.toLocaleString()}</div>
            </div>
            <div className={styles.statCard}>
              <h3>{t('conversionRate')}</h3>
              <div className={styles.statValue}>{analyticsData.conversionRate.toFixed(2)}%</div>
            </div>
          </div>
          
          <div className={styles.chartRow}>
            <div className={styles.chartCard}>
              <h3>{t('topPages')}</h3>
              {analyticsData.topPages.length > 0 ? (
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Path</th>
                      <th>Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.topPages.map((page, index) => (
                      <tr key={index}>
                        <td>{page.path}</td>
                        <td>{page.views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className={styles.noData}>No data available for this period</p>
              )}
            </div>
          </div>
          
          <div className={styles.chartRow}>
            <div className={styles.chartCard}>
              <h3>{t('formSubmissions')}</h3>
              <div className={styles.formSubmissionsData}>
                <div className={styles.formSubmissionStat}>
                  <span className={styles.statLabel}>Contact Forms:</span>
                  <span className={styles.statNumber}>{analyticsData.formSubmissions.byType.contact}</span>
                </div>
                <div className={styles.formSubmissionStat}>
                  <span className={styles.statLabel}>Event Forms:</span>
                  <span className={styles.statNumber}>{analyticsData.formSubmissions.byType.event}</span>
                </div>
                <div className={styles.formSubmissionStat}>
                  <span className={styles.statLabel}>Other Forms:</span>
                  <span className={styles.statNumber}>{analyticsData.formSubmissions.byType.other}</span>
                </div>
                <div className={styles.formSubmissionStat}>
                  <span className={styles.statLabel}>Success Rate:</span>
                  <span className={styles.statNumber}>{successRate}%</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Дополнительная аналитика, которая будет реализована в следующих обновлениях */}
          <div className={styles.chartRow}>
            <div className={styles.chartCard}>
              <h3>Additional Analytics</h3>
              <p className={styles.comingSoon}>More detailed analytics will be available in upcoming updates</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsManager; 