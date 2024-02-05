import { Configurator } from '../configurator/Configurator'
import { AssetI } from '../configurator/type'
import { Command } from './Command'

export class AddItemCommand extends Command {
	public name: string = 'AddItemCommand';
	public asset: AssetI;
	public nameProperty: string;

	constructor(configurator: Configurator, nameProperty: string, asset: AssetI) {
		super(configurator);
		this.asset = asset;
		this.nameProperty = nameProperty;
	}

	public executeCommand(): boolean {
    this.configurator.setPropertyThreekitData(this.nameProperty, this.asset);
    this.changeProperties.push(this.nameProperty);
    return true;
  }

}