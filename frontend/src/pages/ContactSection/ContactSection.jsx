import { useStrapi } from "../../hooks/useStrapi";
import ContactCard from "../Contact/Contact";
import Loader from  "../../components/Loader/Loader"
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";



export default function ServicesSection (){
    const { data, loading, error } = useStrapi('contact');

    if (loading) return <Loader />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <section id="contact">
            <div>
                {data && (
                    <ContactCard
                        contactTitle={data.contactTitle} mottoText={data.mottoText} dataTitle={data.dataTitle} dataEmail={data.dataEmail}  dataText={data.dataText} dataNumber1={data.dataNumber1}
                    />
                )}
            </div>
        </section>
    );
}