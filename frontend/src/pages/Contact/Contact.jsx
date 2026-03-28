import { FiPhone, FiMail } from "react-icons/fi";
import styles  from "./Contact.module.css"

export default function Contact({contactTitle,mottoText ,dataTitle,dataEmail,dataText,dataNumber1,
    formTitle,  formName , formSurname, formPhone , formEmail, formMessage, ctaSendMessage
}) {
    return (
         <div className={styles.pagecontainer}>
      <h1 className={styles.contacttitle}>{contactTitle}</h1>
      <div className={styles.contactlayout}>
        <div className={styles.contactinfo}>
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
              </div>

   <div className={styles.contactbottom}> 
            <p className={styles.infoshorttext}>
            {dataText}
            </p>
          </div>
            </div>
            </div>

            
         <div className={styles.contactformcard}>
          <h2>{formTitle}</h2>

          <form className={styles.contactform}>
            <div className={styles.formgroup}>
              <label>{formName}</label>
              <input type="text" className={styles.input} />
            </div>
           
            <div className={styles.formgroup}>
              <label>{formSurname}</label>
              <input type="text" className={styles.input}/>
            </div>

             <div className={styles.formgroup}>
              <label>{formPhone}</label>
              <input type="tel" className={styles.input}/>
            </div>

            <div className={styles.formgroup}>
              <label>{formEmail}</label>
              <input type="email" className={styles.input}  />
            </div>

            <div className={styles.formgroup}>
              <label>{formMessage}</label>
              <textarea rows="5" className={styles.formgroup} id="messageArea"   />
            </div>

            <button type="submit" className={styles.btnsendMessage}>
             {ctaSendMessage}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}