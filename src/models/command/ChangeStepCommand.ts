import { Command } from './Command'
import { Configurator } from '../configurator/Configurator'
import { StepName } from '../permission/type'
import { ChangeStepBehavior } from './behavior/ChangeStepBehavior'

export class ChangeStepCommand extends Command {
	public name: string = 'ChangeStepCommand';
	public stepName: StepName;

	constructor(configurator: Configurator, stepName: StepName) {
		super(configurator);
		this.stepName = stepName;
		this.behaviors.push(new ChangeStepBehavior());
	}

	public executeCommand() {
		return true;
	}
}