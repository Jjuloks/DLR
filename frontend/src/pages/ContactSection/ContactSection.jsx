import { useStrapi } from "../../hooks/useStrapi";
import ContactCard from "../Contact/Contact";
import Loader from  "../../components/Loader/Loader"
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import styles from "./ContactSection.module.css"



export default function ServicesSection (){
    const { data, loading, error } = useStrapi('contact');

    if (loading) return <Loader />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <section id="contact" styles={styles.section}>
            <div className={styles.container}>
                {data && (
                    //left side
                    <ContactCard
                      contactTitle={data.contactTitle} mottoText={data.mottoText} dataTitle={data.dataTitle} dataEmail={data.dataEmail}  dataText={data.dataText} dataNumber1={data.dataNumber1} 
//right side
formTitle ={data.formTitle} formName={data.formName} formSurname={data.formSurname} formPhone={data.formPhone} ctaSendMessage={data.ctaSendMessage} formEmail={data.formEmail}  formMessage={data.formMessage}

                    />
                )}
            </div>
        </section>
    );
}