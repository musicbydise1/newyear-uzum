import React, { useRef, useState } from "react";
import Image from "next/image";
import styles from "./Section6.module.scss";
import { useLanguage } from "../contexts/LanguageContext";
import Logo from "./Logo";
import SegmentedControl from "./SegmentedControl";
import WishModal from "./WishModal";
import { useIsMobile } from '../hooks/useIsMobile';
import { useIsHeightBelow950 } from '../hooks/useIsHeightBelow950';

export default function Section6({
  scrollTo,
  goToSectionRef,
  showArrow,
  headline,
}) {
  const headlineRef = useRef();
  const sectionRef = useRef();
  const { t, locale, changeLanguage } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const isHeightBelow950 = useIsHeightBelow950();

  const languageData = [
    { value: 'ru', label: 'RU' },
    { value: 'uz', label: 'UZ' },
  ];

  return (
    <div className={styles.section} ref={sectionRef}>
      <div className={styles.logoWrapper}>
        <Logo />
      </div>
      <div className={styles.bellTopLeft}>
        <Image 
          src="/images/bell.webp" 
          alt="Bell" 
          width={isMobile ? 150 : (!isMobile && isHeightBelow950 ? 180 : 200)} 
          height={isMobile ? 170 : (!isMobile && isHeightBelow950 ? 200 : 220)}
        />
      </div>
      <div className={styles.topRightContainer}>
        <div className={styles.segmentedControlWrapper}>
          <SegmentedControl
            data={languageData}
            value={locale}
            onChange={changeLanguage}
          />
        </div>
        <div className={styles.bellTopRight}>
          <Image 
            src="/images/bell.webp" 
            alt="Bell" 
            width={isMobile ? 80 : (!isMobile && isHeightBelow950 ? 120 : 150)} 
            height={isMobile ? 100 : (!isMobile && isHeightBelow950 ? 140 : 170)}
          />
        </div>
      </div>
      <div className={styles.copy}>
        <h2 ref={headlineRef}>
          {headline && headline.split(/<br\s*\/?>/i).map((line, index, array) => (
            <React.Fragment key={index}>
              {line.split(/(2026)/i).map((part, partIndex) => 
                part.toLowerCase() === '2026' ? (
                  <span key={partIndex} className={styles.year2026}>{part}</span>
                ) : (
                  <React.Fragment key={partIndex}>{part}</React.Fragment>
                )
              )}
              {index < array.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h2>
      </div>
      <button 
        className={styles.actionButton}
        onClick={() => setIsModalOpen(true)}
      >
        {t("sections.section6Button")}
      </button>
      <WishModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        locale={locale}
        shareButton={t("sections.shareButton")}
        downloadButton={t("sections.downloadButton")}
      />
      <div className={styles.gingerbreadBottomLeft}>
        <Image 
          src="/images/gingerbread.webp" 
          alt="Gingerbread" 
          width={isMobile ? 300 : (!isMobile && isHeightBelow950 ? 380 : 450)} 
          height={isMobile ? 250 : (!isMobile && isHeightBelow950 ? 320 : 380)}
        />
      </div>
      <div className={styles.treeBottomRight}>
        <Image 
          src="/images/tree.webp" 
          alt="Tree" 
          width={isMobile ? 300 : (!isMobile && isHeightBelow950 ? 350 : 400)} 
          height={isMobile ? 400 : (!isMobile && isHeightBelow950 ? 480 : 550)}
        />
      </div>
    </div>
  );
}

