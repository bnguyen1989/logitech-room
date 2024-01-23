import s from './Field.module.scss';

interface PropsI {
	required?: boolean;
	placeholder?: string;
}
export const Field: React.FC<PropsI> = (props) => {
	const { required, placeholder } = props;

	const textPlaceholder = required ? `${placeholder} *` : placeholder;
	return (
		<input 
			type="text" 
			className={s.input}
			placeholder={textPlaceholder}
			required={required} 
			/>
	)

}