import styles  from  "./Progress.module.css"


export default function Progress({title
}) {
    return (
         <div className={styles.pagecontainer}>
            <p>{title}</p>
    </div>
  );
}