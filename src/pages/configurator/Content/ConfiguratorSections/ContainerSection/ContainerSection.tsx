import { ConfiguratorPlayer } from '../../../../../components/configuratorPlayer/ConfiguratorPlayer'
import s from './ContainerSection.module.scss';

interface PropsI {
	children: React.ReactNode
}
export const ContainerSection: React.FC<PropsI> = (props) => {
	const { children } = props;
	return (
		<div className={s.container}>

			<div className={s.player}>
				<ConfiguratorPlayer />
			</div>
			<div className={s.form}>
				{children}
			</div>

		</div>
	)
}