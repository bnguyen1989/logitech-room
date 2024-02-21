import { Configurator } from '../configurator/Configurator'
import { Command } from './Command'

export class ChangeCountItemCommand extends Command {
	public name: string = 'ChangeCountItemCommand';
	public nameProperty: string;
	public value: string;
	public assetId: string;
	
	constructor(configurator: Configurator, nameProperty: string, value: string, assetId: string) {
		super(configurator);
		this.nameProperty = nameProperty;
		this.value = value;
		this.assetId = assetId;
	}

	public executeCommand(): boolean {
		this.configurator.setConfiguration({
			[this.nameProperty]: this.value
		});
    this.changeProperties.push(this.nameProperty);
		return true;
	}
		
}