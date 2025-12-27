import React from 'react';
import Image from 'next/image';
import styles from './WishTemplate.module.scss';

const WishTemplate = React.forwardRef(({ wishText }, ref) => {
  return (
    <div ref={ref} className={styles.template}>
      <div className={styles.background}>
        {/* Эффект снега */}
        <div className={styles.snowflakes}></div>
        
        {/* Текст пожелания по центру */}
        <div className={styles.wishContainer}>
          <p className={styles.wishText}>
            {wishText && wishText.split(/(2026)/i).map((part, partIndex) => 
              part.toLowerCase() === '2026' ? (
                <span key={partIndex} className={styles.year2026}>{part}</span>
              ) : (
                <React.Fragment key={partIndex}>{part}</React.Fragment>
              )
            )}
          </p>
        </div>
        
        {/* Пряничный человечек внизу слева */}
        <div className={styles.gingerbread}>
          <Image
            src="/images/gingerbread.webp"
            alt="Gingerbread"
            width={750}
            height={700}
            unoptimized
            priority
          />
        </div>
        
        {/* Елка внизу справа */}
        <div className={styles.tree}>
          <Image
            src="/images/tree.webp"
            alt="Tree"
            width={600}
            height={750}
            unoptimized
            priority
          />
        </div>
      </div>
    </div>
  );
});

WishTemplate.displayName = 'WishTemplate';

export default WishTemplate;

