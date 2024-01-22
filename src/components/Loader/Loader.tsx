import s from './Loader.module.scss';

interface PropsI {
	text?: string;
}
export const Loader: React.FC<PropsI> = (props) => {
	const { text } = props;

	return (
		<div className={s.container}>
			<div className={s.loader}></div>
			{!!text && <div className={s.text}>{text}</div>}
		</div>
		
	)
}