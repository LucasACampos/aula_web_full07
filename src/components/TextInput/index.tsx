import styles from './styles.module.scss'

type Props = {
    type: string,
    label: string,
    value?: string,
    disable?: boolean,
    change: (value: string) => void,
}

export default function TextInput({ type, label, change, value, disable }: Props) {
    return (
        <div className={styles.textInput}>
            <span>{label}:</span>
            <input
                type={type}
                value={value}
                disabled={disable}
                onChange={event => change(event.target.value)}
            />
        </div>
    )
}