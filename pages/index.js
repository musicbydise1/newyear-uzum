import { useRouter } from 'next/router';
import Head from 'next/head';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/Welcome.module.scss';

export default function Welcome() {
  const router = useRouter();
  const { changeLanguage, t } = useLanguage();

  const handleLanguageSelect = (locale) => {
    changeLanguage(locale);
    router.push('/home');
  };

  return (
    <div className={styles.welcomeContainer}>
      <Head>
        <title>{t('welcome.title')}</title>
        <meta name="description" content="Select your language" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.content}>
        <h1 className={styles.title}>{t('welcome.title')}</h1>
        <p className={styles.subtitle}>{t('welcome.selectLanguage')}</p>
        <div className={styles.buttonContainer}>
          <button
            className={styles.languageButton}
            onClick={() => handleLanguageSelect('ru')}
          >
            {t('welcome.russian')}
          </button>
          <button
            className={styles.languageButton}
            onClick={() => handleLanguageSelect('uz')}
          >
            {t('welcome.uzbek')}
          </button>
        </div>
      </div>
    </div>
  );
}
