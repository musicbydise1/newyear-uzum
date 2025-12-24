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
        <title>Выберите язык</title>
        <meta name="description" content="Select your language" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.content}>
        <h1 className={styles.title}>{t('welcome.title')}</h1>
        <p className={styles.subtitle}>{t('welcome.subtitle')}</p>
        <div className={styles.buttonContainer}>
          <button
            className={styles.languageButton}
            onClick={() => handleLanguageSelect('ru')}
          >
            <span className={styles.buttonText}>{t('welcome.russian')}</span>
            <span className={styles.buttonSubtext}>{t('welcome.russianSubtitle')}</span>
          </button>
          <button
            className={styles.languageButton}
            onClick={() => handleLanguageSelect('uz')}
          >
            <span className={styles.buttonText}>{t('welcome.uzbek')}</span>
            <span className={styles.buttonSubtext}>{t('welcome.uzbekSubtitle')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
