import type { Property } from '../properties/index.js';

type PlugsBase<T> = Record<string, T[]>;
type Plugs = PlugsBase<Property>;

export default function unpackPlugs(
  id: string,
  objects: Record<string, string>
): Plugs {
  const plugsStr = objects[id];
  if (!plugsStr)
    throw new Error(`No object found matching the "plugs" id: ${id}`);
  const plugsPacked: PlugsBase<string> = JSON.parse(plugsStr);

  const plugs = Object.entries(plugsPacked).reduce(
    (output: Plugs, [plugName, plugPacked]: [string, string[]]) => {
      const plug = plugPacked.map((propertyId) => {
        const propertyStr = objects[propertyId];
        if (!propertyStr)
          throw Error(
            `No object found matching the "property" id: ${propertyId}`
          );
        const property: Property = JSON.parse(propertyStr);
        return property;
      });
      return Object.assign(output, {
        [plugName]: plug
      });
    },
    {}
  );

  return plugs;
}
