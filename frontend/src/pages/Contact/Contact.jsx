import { FiPhone, FiMail } from "react-icons/fi";
import styles  from "./Contact.module.css"
export default function Contact({contactTitle,mottoText ,dataTitle,dataEmail,dataText,dataNumber1}) {
    return (
         <div className={styles.pagecontainer}>
      <h1 className={styles.contacttitle}>{contactTitle}</h1>
      <div className={styles.contactlayout}>
        <div className={styles.contentinfo}>
          <div className={styles.myinfo}>

            <div className={styles.infotop}>
            <h1>{mottoText}</h1>
             </div>

            <div className={styles.infomiddle}>
            <h2>{dataTitle}</h2>
            <div className={styles.infoitem}> 
            <FiPhone className={styles.icon} />
              <a href="tel:+48796429229">{dataNumber1}</a>
            </div>

            <div className={styles.infoitem}>
            <FiMail className={styles.icon} />
              <a href="mailto:julowicz@gmail.com"> {dataEmail}</a>
            </div>

   <div className={styles.contactbottom}> 
            <p className={styles.infoshorttext}>
            {dataText}
            </p>
          </div>
            </div>
            </div>
            </div>
            </div>
            </div>
    )
}