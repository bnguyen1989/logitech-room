import { useConfigurator } from '@threekit/configurator';

import { Dropdown } from './Dropdown.js';

export default function ProductForm(props: {
  assetId: string;
  assetKey: string;
}) {
  const { assetId, assetKey } = props;
  const product = useConfigurator(assetId, assetKey);
  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>
        {product.name}
      </div>
      {product.attributes?.map((attribute) => {
        if (!attribute.visible) return null;
        if (!['Asset', 'String'].includes(attribute.type)) return null;
        return (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '18px' }}>{attribute.name}</div>
            <div>
              {'values' in attribute && (
                <Dropdown
                  options={attribute.values.map((val) => ({
                    ...val,
                    label: val.name ?? val.label,
                    value:
                      'assetId' in val ? { assetId: val.assetId } : val.value
                  }))}
                  onSelect={(val) =>
                    product.setConfiguration({ [attribute.name]: val })
                  }
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
