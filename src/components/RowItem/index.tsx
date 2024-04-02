import styles from './styles.module.scss'

type Props = {
    title: string,
    subTitle?: string,
    modelId?: number,
    edit: (id: number) => void,
    remove: (id: number) => void,
}

export default function RowItem(props: Props) {
    return (
        <div className={styles.item}>
            <div className={styles.title}>{ props.title }</div>
            <div className={styles.subTitle}>{ props.subTitle }</div>
            <div>
                <button
                    className={styles.editButton}
                    onClick={() => props.edit(props.modelId!)}
                >
                    EDITAR
                </button>

                <button
                    className={styles.removeButton}
                    onClick={() => props.remove(props.modelId!)}
                >
                    REMOVER
                </button>
            </div>
        </div>
    )
}
