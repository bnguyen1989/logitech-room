export class RuleBuilder {
  rule: Record<string, any>;
  currentAttribute: string = "";

  constructor() {
    this.rule = {};
  }

  static newRule() {
    return new RuleBuilder();
  }

  // Ініціалізує будівництво правила для заданого атрибуту
  ruleFor(attribute: string) {
    this.currentAttribute = attribute;
    return this; // повертаємо this для забезпечення ланцюгових викликів
  }

  // Встановлює умову "рівність" для поточного атрибуту
  equalTo(value: any) {
    if (this.currentAttribute) {
      this.rule[this.currentAttribute] = value;
    }
    return this; // повертаємо this для продовження ланцюга
  }

  // Будує кінцевий об'єкт правила
  build() {
    const builtRule = this.rule;
    this.rule = {}; // Очистити поточний стан для можливості повторного використання
    return builtRule;
  }
}
