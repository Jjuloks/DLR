import { useStrapi } from "../../hooks/useStrapi";
import ProgressCard from "../Progress/Progress";
import Loader from  "../../components/Loader/Loader"
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import styles from "./ProgressSection.module.css"



export default function ServicesSection (){
    const { data, loading, error } = useStrapi('progress');

    if (loading) return <Loader />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <section id="progress" styles={styles.section}>
            <div className={styles.container}>
                {data && (
                  
                   <ProgressCard title={data.title} />
                )}
            </div>
        </section>
    );
}