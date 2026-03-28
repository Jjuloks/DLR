import styles from './Footer.module.css'

const Footer = () => {
  return (
       <footer className={styles.footer}>
            <div className={styles.footercontainer}> 
                <p className={styles.footertext}> 
      © 2026 DailyRoutine —  All rights reserved
      </p>
      </div>
    </footer>
  )
}

export default Footer